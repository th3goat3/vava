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
  let responseSent = false;
  
  // Helper to send response only once
  const sendResponse = (status, data) => {
    if (!responseSent) {
      responseSent = true;
      res.status(status).json(data);
    }
  };

  // Overall timeout wrapper (20 seconds total)
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Request timeout: Instagram scraping took too long'));
    }, 20000);
  });

  const scrapePromise = (async () => {
    try {
      console.log(`Starting scrape for: ${username}`);
      
      console.log('Launching browser...');
      browser = await puppeteer.launch({
        headless: "new",
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu'
        ],
        timeout: 10000
      });
      console.log('Browser launched successfully');

      const page = await browser.newPage();
      
      // Set a realistic viewport and user agent
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      // Set aggressive timeouts
      page.setDefaultTimeout(10000);
      page.setDefaultNavigationTimeout(10000);
      
      // Navigate to Instagram profile
      const profileUrl = `https://www.instagram.com/${username}/`;
      console.log(`Navigating to: ${profileUrl}`);
      
      try {
        await page.goto(profileUrl, { 
          waitUntil: 'domcontentloaded', 
          timeout: 10000 
        });
      } catch (navError) {
        console.error('Navigation error:', navError.message);
        throw new Error('Failed to load Instagram profile. Instagram may require login or be blocking requests.');
      }

      // Quick wait for content
      try {
        await page.waitForTimeout(1500);
      } catch (e) {
        // Continue
      }
      
      // Check if we're on a login page
      const pageUrl = page.url();
      if (pageUrl.includes('/accounts/login') || pageUrl.includes('/login')) {
        throw new Error('Instagram requires login. Please note that scraping may not work without authentication.');
      }
      
      // Check if page contains error message
      let pageContent;
      try {
        pageContent = await page.content();
      } catch (e) {
        throw new Error('Failed to get page content. Instagram may be blocking automated requests.');
      }
      
      if (pageContent.includes('Sorry, this page isn\'t available') || 
          pageContent.includes('User not found') ||
          pageContent.includes('page not found')) {
        throw new Error('Profile not found. Please check the username.');
      }

      // Scrape profile data
      console.log('Extracting profile data...');
      const profileData = await page.evaluate(() => {
        const data = {
          profilePicture: null,
          followers: null,
          error: null
        };

      try {
        // Get profile picture - try multiple selectors (updated for current Instagram)
        const imgSelectors = [
          'img[src*="s150x150"]',
          'img[src*="s320x320"]',
          'img[src*="s640x640"]',
          'header img',
          'article header img',
          'section img',
          'img[alt*="profile picture" i]',
          'img[alt*="Profile picture" i]',
          'img[alt*="Profile Picture" i]'
        ];

        for (const selector of imgSelectors) {
          const imgs = document.querySelectorAll(selector);
          for (const img of imgs) {
            if (img.src && (img.src.includes('instagram') || img.src.includes('cdninstagram'))) {
              // Get the highest resolution version
              data.profilePicture = img.src.replace(/s\d+x\d+\//, 's640x640/');
              break;
            }
          }
          if (data.profilePicture) break;
        }
        
        // Try to find in meta tags as fallback
        if (!data.profilePicture) {
          const metaImg = document.querySelector('meta[property="og:image"]');
          if (metaImg) {
            data.profilePicture = metaImg.getAttribute('content');
          }
        }

        // Get followers count - try multiple methods
        // Method 1: Look for links with /followers in href
        const followerLinks = Array.from(document.querySelectorAll('a[href*="/followers"]'));
        for (const link of followerLinks) {
          // Try to find the count in the link or nearby elements
          const spans = link.querySelectorAll('span');
          for (const span of spans) {
            const title = span.getAttribute('title');
            const text = span.textContent.trim();
            if (title && /[\d,]+/.test(title)) {
              data.followers = title;
              break;
            }
            if (text && /[\d,]+/.test(text) && text.length < 20) {
              data.followers = text;
              break;
            }
          }
          if (data.followers) break;
        }

        // Method 2: Look in header ul li structure
        if (!data.followers) {
          const listItems = Array.from(document.querySelectorAll('header ul li, header li'));
          for (const li of listItems) {
            const link = li.querySelector('a[href*="/followers"]');
            if (link) {
              const span = link.querySelector('span[title], span');
              if (span) {
                const title = span.getAttribute('title');
                const text = span.textContent.trim();
                if (title && /[\d,]+/.test(title)) {
                  data.followers = title;
                  break;
                }
                if (text && /[\d,]+/.test(text) && !text.includes('followers')) {
                  data.followers = text;
                  break;
                }
              }
            }
          }
        }

        // Method 3: Try meta tags
        if (!data.followers) {
          const metaDesc = document.querySelector('meta[name="description"], meta[property="og:description"]');
          if (metaDesc) {
            const content = metaDesc.getAttribute('content') || '';
            const match = content.match(/([\d,]+)\s+Followers/i);
            if (match) {
              data.followers = match[1];
            }
          }
        }
        
        // Method 4: Look for follower count in text content
        if (!data.followers) {
          const allText = document.body.innerText || '';
          const match = allText.match(/([\d,]+)\s+followers?/i);
          if (match) {
            data.followers = match[1];
          }
        }

      } catch (error) {
        data.error = error.message;
      }

        return data;
      });
      
      console.log('Data extracted:', profileData);

      // Close browser
      try {
        await browser.close();
        browser = null;
      } catch (closeError) {
        console.error('Error closing browser:', closeError.message);
      }

      // Return results
      if (profileData.error) {
        throw new Error(profileData.error || 'Failed to extract profile data');
      }

      if (!profileData.profilePicture && !profileData.followers) {
        throw new Error('Could not find profile data. Instagram may require login or the profile structure has changed.');
      }

      return {
        username: username,
        profilePicture: profileData.profilePicture || null,
        followers: profileData.followers || 'N/A',
        success: true
      };
    } catch (error) {
      console.error('Error in scrapePromise:', error);
      console.error('Error stack:', error.stack);
      // Ensure browser is closed on error
      if (browser) {
        try {
          await browser.close().catch(() => {});
        } catch (e) {
          // Ignore
        }
      }
      throw error;
    }
  })();

  // Race between scraping and timeout
  try {
    const result = await Promise.race([scrapePromise, timeoutPromise]);
    sendResponse(200, result);
  } catch (error) {
    console.error('Scraping error:', error);
    console.error('Error stack:', error.stack);
    
    // Ensure browser is closed
    if (browser) {
      try {
        const pages = await browser.pages().catch(() => []);
        await Promise.all(pages.map(p => p.close().catch(() => {})));
        await browser.close().catch(() => {});
      } catch (closeError) {
        console.error('Error closing browser:', closeError.message);
      }
      browser = null;
    }
    
    const errorMessage = error.message || 'Failed to scrape Instagram profile';
    console.error('Sending error response:', errorMessage);
    sendResponse(500, { 
      error: errorMessage,
      details: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

