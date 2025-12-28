const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Increase timeout for all requests
app.use((req, res, next) => {
  req.setTimeout(30000); // 30 seconds
  res.setTimeout(30000);
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Root route - serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint (keeps free tier awake)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Instagram scraper endpoint
app.post('/api/scrape', async (req, res) => {
  let browser = null;
  let responseSent = false;
  
  const sendResponse = (status, data) => {
    if (!responseSent) {
      responseSent = true;
      res.status(status).json(data);
    }
  };
  
  try {
    const { username } = req.body;

    if (!username) {
      return sendResponse(400, { error: 'Username is required' });
    }

    console.log(`[${new Date().toISOString()}] Starting scrape for: ${username}`);
    
    // Launch browser with proper options - try multiple strategies
    try {
      browser = await puppeteer.launch({
        headless: true, // Use old headless first (more stable)
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process'
        ],
        ignoreHTTPSErrors: true,
        timeout: 20000
      });
      console.log('Browser launched successfully');
    } catch (launchError) {
      console.error('Browser launch failed, trying alternative method:', launchError.message);
      // Try with minimal args
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        timeout: 20000
      });
      console.log('Browser launched with minimal args');
    }

    const page = await browser.newPage();
    
    // Set user agent to look more like a real browser
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Set timeouts
    page.setDefaultNavigationTimeout(20000);
    page.setDefaultTimeout(20000);
    
    const profileUrl = `https://www.instagram.com/${username}/`;
    console.log(`Navigating to: ${profileUrl}`);
    
    // Navigate to profile
    await page.goto(profileUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 20000
    });
    
    console.log('Page loaded, waiting for content...');
    
    // Wait a bit for content to load
    await page.waitForTimeout(3000);
    
    // Check if redirected to login
    const currentUrl = page.url();
    if (currentUrl.includes('/accounts/login') || currentUrl.includes('/login')) {
      await browser.close();
      browser = null;
      return sendResponse(403, { 
        error: 'Instagram requires login to view this profile' 
      });
    }
    
    // Extract data
    console.log('Extracting profile data...');
    const profileData = await page.evaluate((username) => {
      const result = {
        profilePicture: null,
        followers: null,
        username: username
      };
      
      // Try to get profile picture from various sources
      // Method 1: Look for img tags with Instagram CDN
      const images = document.querySelectorAll('img');
      for (const img of images) {
        const src = img.getAttribute('src') || '';
        if (src.includes('cdninstagram.com') && (src.includes('s150x150') || src.includes('s320x320'))) {
          result.profilePicture = src.replace(/s\d+x\d+/, 's640x640');
          break;
        }
      }
      
      // Method 2: Try meta og:image
      if (!result.profilePicture) {
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) {
          result.profilePicture = ogImage.getAttribute('content');
        }
      }
      
      // Get followers count - improved to handle K, M abbreviations
      // Look for links containing /followers
      const links = Array.from(document.querySelectorAll('a'));
      for (const link of links) {
        const href = link.getAttribute('href') || '';
        if (href.includes('/followers')) {
          // Get the text content - handle both full numbers and abbreviated (K, M)
          const text = link.textContent.trim();
          
          // Try to find number with optional K/M suffix (e.g., "3.1M", "21K", "4,878")
          const match = text.match(/([\d,]+(?:\.\d+)?)\s*([KkMm]?)/);
          if (match) {
            const number = match[1].replace(/,/g, '');
            const suffix = match[2].toUpperCase();
            result.followers = number + suffix;
            break;
          }
          
          // Try title attribute
          const title = link.getAttribute('title');
          if (title) {
            const titleMatch = title.match(/([\d,]+(?:\.\d+)?)\s*([KkMm]?)/);
            if (titleMatch) {
              const number = titleMatch[1].replace(/,/g, '');
              const suffix = titleMatch[2].toUpperCase();
              result.followers = number + suffix;
              break;
            }
          }
          
          // Also check for spans inside the link
          const spans = link.querySelectorAll('span');
          for (const span of spans) {
            const spanText = span.textContent.trim();
            const spanMatch = spanText.match(/([\d,]+(?:\.\d+)?)\s*([KkMm]?)/);
            if (spanMatch) {
              const number = spanMatch[1].replace(/,/g, '');
              const suffix = spanMatch[2].toUpperCase();
              result.followers = number + suffix;
              break;
            }
            
            // Check title attribute of span
            const spanTitle = span.getAttribute('title');
            if (spanTitle) {
              const spanTitleMatch = spanTitle.match(/([\d,]+(?:\.\d+)?)\s*([KkMm]?)/);
              if (spanTitleMatch) {
                const number = spanTitleMatch[1].replace(/,/g, '');
                const suffix = spanTitleMatch[2].toUpperCase();
                result.followers = number + suffix;
                break;
              }
            }
          }
          if (result.followers) break;
        }
      }
      
      // Try meta description as fallback
      if (!result.followers) {
        const metaDesc = document.querySelector('meta[name="description"], meta[property="og:description"]');
        if (metaDesc) {
          const content = metaDesc.getAttribute('content') || '';
          // Match numbers with optional K/M suffix (e.g., "3.1M Followers", "21K Followers")
          const match = content.match(/([\d,]+(?:\.\d+)?)\s*([KkMm]?)\s+Followers?/i);
          if (match) {
            const number = match[1].replace(/,/g, '');
            const suffix = match[2].toUpperCase();
            result.followers = number + suffix;
          }
        }
      }
      
      // Last resort: search all text content for follower count pattern
      if (!result.followers) {
        const bodyText = document.body.innerText || '';
        const match = bodyText.match(/([\d,]+(?:\.\d+)?)\s*([KkMm]?)\s+followers?/i);
        if (match) {
          const number = match[1].replace(/,/g, '');
          const suffix = match[2].toUpperCase();
          result.followers = number + suffix;
        }
      }
      
      return result;
    }, username);
    
    console.log('Profile data extracted:', profileData);
    
    // Close browser before sending response
    await browser.close();
    browser = null;
    
    // Check if we got any data
    if (!profileData.profilePicture && !profileData.followers) {
      return sendResponse(404, {
        error: 'Could not extract profile data. The profile may be private or the username may not exist.'
      });
    }
    
    // Send success response
    sendResponse(200, {
      username: username,
      profilePicture: profileData.profilePicture || null,
      followers: profileData.followers || 'N/A',
      success: true
    });
    
  } catch (error) {
    console.error('Error during scraping:', error);
    
    // Extract actual error message
    let errorMessage = 'Failed to scrape Instagram profile';
    if (error.message) {
      errorMessage = error.message;
    } else if (error.toString) {
      const errorStr = error.toString();
      if (errorStr.includes('socket hang up') || errorStr.includes('ECONNRESET')) {
        errorMessage = 'Browser connection failed. Please ensure Chrome/Chromium is installed correctly.';
      } else {
        errorMessage = errorStr;
      }
    }
    
    // Check if it's a browser launch error
    if (errorMessage.includes('socket hang up') || errorMessage.includes('ECONNRESET')) {
      errorMessage = 'Browser connection failed. Chrome/Chromium may not be installed correctly. Try: npm install puppeteer --force';
    }
    
    // Ensure browser is closed
    if (browser) {
      try {
        await browser.close().catch(() => {});
      } catch (closeErr) {
        console.error('Error closing browser:', closeErr);
      }
      browser = null;
    }
    
    // Send error response
    sendResponse(500, {
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? (error.stack || error.toString()) : undefined
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

