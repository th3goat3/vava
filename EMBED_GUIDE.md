# Embedding Scraper on Your SiteGround Website

You can absolutely use Render.com to host your scraper and embed it on your SiteGround site!

## 🎯 Two Main Approaches:

### Option 1: Embed as iFrame (Easiest) ⭐ RECOMMENDED

Embed the entire scraper interface on your SiteGround site:

```html
<!-- On your SiteGround website -->
<iframe 
  src="https://your-scraper.onrender.com" 
  width="100%" 
  height="600px"
  frameborder="0"
  style="border-radius: 10px;">
</iframe>
```

**Pros:**
- ✅ Super easy - just add iframe code
- ✅ No code changes needed
- ✅ Works immediately
- ✅ Isolated (scraper runs independently)

**Cons:**
- ❌ Doesn't match your site's exact styling (unless you customize)
- ❌ Shows Render.com URL in iframe

---

### Option 2: API Integration (Best Integration) ⭐ BEST UX

Use your scraper as an API and build a custom UI on your SiteGround site.

#### Step 1: Keep the scraper on Render.com as an API

Your scraper already has the API endpoint: `POST /api/scrape`

#### Step 2: Create a simple HTML page on your SiteGround site

Create a new page on your SiteGround site (e.g., `instagram-checker.html`):

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instagram Profile Checker</title>
    <style>
        /* Your custom styling here */
        body {
            font-family: Arial, sans-serif;
            max-width: 500px;
            margin: 50px auto;
            padding: 20px;
        }
        .input-group {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        button {
            padding: 10px 20px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .result {
            text-align: center;
            padding: 20px;
            background: #f5f5f5;
            border-radius: 10px;
            margin-top: 20px;
        }
        .profile-picture {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            margin: 20px auto;
            display: block;
        }
        .error {
            color: red;
            padding: 10px;
            background: #fee;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <h1>Check Instagram Profile</h1>
    
    <div class="input-group">
        <input type="text" id="username" placeholder="Enter Instagram username" />
        <button onclick="checkProfile()">Check</button>
    </div>
    
    <div id="result"></div>
    
    <script>
        const API_URL = 'https://your-scraper.onrender.com/api/scrape';
        
        async function checkProfile() {
            const username = document.getElementById('username').value.trim();
            const resultDiv = document.getElementById('result');
            
            if (!username) {
                resultDiv.innerHTML = '<div class="error">Please enter a username</div>';
                return;
            }
            
            resultDiv.innerHTML = '<p>Loading...</p>';
            
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: username })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    resultDiv.innerHTML = `<div class="error">${data.error || 'Failed to fetch profile'}</div>`;
                    return;
                }
                
                // Display results
                resultDiv.innerHTML = `
                    <div class="result">
                        <img src="${data.profilePicture || 'placeholder.png'}" 
                             alt="Profile" 
                             class="profile-picture"
                             onerror="this.src='https://via.placeholder.com/120'">
                        <h2>@${data.username}</h2>
                        <p><strong>Followers:</strong> ${data.followers}</p>
                    </div>
                `;
                
            } catch (error) {
                resultDiv.innerHTML = '<div class="error">Network error. Please try again.</div>';
                console.error('Error:', error);
            }
        }
        
        // Allow Enter key to submit
        document.getElementById('username').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkProfile();
            }
        });
    </script>
</body>
</html>
```

**Pros:**
- ✅ Fully integrated with your site's design
- ✅ Matches your branding
- ✅ Better user experience
- ✅ No iframe borders

**Cons:**
- ⚠️ Requires CORS configuration (see below)

---

## 🔧 Important: CORS Configuration

Since you're calling the API from your SiteGround site, you need to enable CORS on your Render.com scraper.

Your `server.js` already has CORS enabled! ✅

But make sure it allows your SiteGround domain:

```javascript
// In server.js - update CORS if needed
app.use(cors({
  origin: [
    'https://your-siteground-domain.com',
    'https://www.your-siteground-domain.com',
    'https://your-scraper.onrender.com' // Allow your own Render URL
  ],
  credentials: true
}));
```

Or allow all origins (less secure, but easier):
```javascript
app.use(cors()); // Already in your code! ✅
```

---

## 📋 Step-by-Step Implementation

### For Option 1 (iFrame):

1. Deploy scraper to Render.com
2. Get your Render URL: `https://your-scraper.onrender.com`
3. On your SiteGround site, add:
   ```html
   <iframe src="https://your-scraper.onrender.com" width="100%" height="600"></iframe>
   ```
4. Done!

### For Option 2 (API Integration):

1. Deploy scraper to Render.com
2. Get your Render URL: `https://your-scraper.onrender.com`
3. Create HTML page on SiteGround (like example above)
4. Replace `API_URL` in the JavaScript with your Render URL
5. Upload to your SiteGround site
6. Done!

---

## 🎨 Customization Tips

### Match Your Site's Styling:

In Option 2, update the `<style>` section to match your site:
- Colors
- Fonts
- Layout
- Buttons
- Spacing

### Add Your Branding:

- Add your logo
- Use your color scheme
- Match your site's design language

---

## ✅ Checklist

- [ ] Deploy scraper to Render.com
- [ ] Test scraper at Render URL
- [ ] Choose embedding method (iFrame or API)
- [ ] Create/update HTML page on SiteGround
- [ ] Test on your SiteGround site
- [ ] Customize styling to match your site

---

## 🚀 Quick Start (Recommended: API Integration)

1. **Deploy to Render.com** (5 minutes)
   - Push code to GitHub
   - Deploy on Render
   - Get your URL

2. **Update CORS** (if needed)
   - Your code already has `cors()` enabled ✅
   - Should work out of the box!

3. **Create page on SiteGround**
   - Copy the HTML example above
   - Update `API_URL` with your Render URL
   - Customize styling
   - Upload to SiteGround

4. **Test**
   - Visit your new page
   - Test the scraper
   - Done! 🎉

---

## Need Help?

If you need help with any step, let me know! I can:
- Help you deploy to Render
- Customize the HTML/CSS for your site
- Set up the API integration
- Debug any issues

