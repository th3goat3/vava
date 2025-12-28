const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Root route - serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Instagram scraper endpoint
app.post('/api/scrape', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  let browser = null;
  
  try {
    console.log(`[${new Date().toISOString()}] Starting scrape for: ${username}`);
    
    // Launch browser with proper options
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--disable-blink-features=AutomationControlled'
      ]
    });
    
    console.log('Browser launched');

    const page = await browser.newPage();
    
    // Set user agent to look more like a real browser
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Set timeouts
    page.setDefaultNavigationTimeout(15000);
    page.setDefaultTimeout(15000);
    
    const profileUrl = `https://www.instagram.com/${username}/`;
    console.log(`Navigating to: ${profileUrl}`);
    
    // Navigate to profile
    await page.goto(profileUrl, {
      waitUntil: 'networkidle0',
      timeout: 15000
    });
    
    console.log('Page loaded, waiting for content...');
    
    // Wait a bit for content to load
    await page.waitForTimeout(3000);
    
    // Check if redirected to login
    const currentUrl = page.url();
    if (currentUrl.includes('/accounts/login') || currentUrl.includes('/login')) {
      await browser.close();
      return res.status(403).json({ 
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
      
      // Get followers count
      // Look for links containing /followers
      const links = Array.from(document.querySelectorAll('a'));
      for (const link of links) {
        const href = link.getAttribute('href') || '';
        if (href.includes('/followers')) {
          // Get the text content
          const text = link.textContent.trim();
          const match = text.match(/([\d,]+)/);
          if (match) {
            result.followers = match[1];
            break;
          }
          
          // Try title attribute
          const title = link.getAttribute('title');
          if (title) {
            const titleMatch = title.match(/([\d,]+)/);
            if (titleMatch) {
              result.followers = titleMatch[1];
              break;
            }
          }
        }
      }
      
      // Try meta description as fallback
      if (!result.followers) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          const content = metaDesc.getAttribute('content') || '';
          const match = content.match(/([\d,]+)\s+Followers/i);
          if (match) {
            result.followers = match[1];
          }
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
      return res.status(404).json({
        error: 'Could not extract profile data. The profile may be private or the username may not exist.'
      });
    }
    
    // Send success response
    res.json({
      username: username,
      profilePicture: profileData.profilePicture || null,
      followers: profileData.followers || 'N/A',
      success: true
    });
    
  } catch (error) {
    console.error('Error during scraping:', error);
    
    // Ensure browser is closed
    if (browser) {
      try {
        await browser.close();
      } catch (closeErr) {
        console.error('Error closing browser:', closeErr);
      }
    }
    
    // Send error response
    if (!res.headersSent) {
      res.status(500).json({
        error: error.message || 'Failed to scrape Instagram profile',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

