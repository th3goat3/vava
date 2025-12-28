# Quick SiteGround Deployment Guide

Your Instagram scraper is ready to deploy! Follow these steps:

## 📦 Step 1: Prepare Files for Upload

**Option A: Create a ZIP file (Easiest)**
1. Select all files EXCEPT `node_modules` folder
2. Create a ZIP file
3. Files to include:
   - `server.js`
   - `package.json`
   - `ecosystem.config.js`
   - `public/` folder (with all contents)
   - `.gitignore`

**Option B: Use SSH/SCP** (if you've set up SSH)

## 🚀 Step 2: Upload to SiteGround

### Using cPanel File Manager:
1. Log into **SiteGround cPanel**
2. Open **File Manager**
3. Navigate to your domain folder:
   - For main domain: `public_html/`
   - For subdomain: `subdomain.yourdomain.com/`
4. **Upload** your ZIP file
5. **Extract** the ZIP file in File Manager
6. **Delete** the ZIP file after extraction

### Or using SSH:
```bash
# Connect via SSH (use your SSH key from earlier)
ssh -i ~/.ssh/macbook username@your-domain.com -p PORT

# Navigate to your domain directory
cd public_html  # or your subdomain folder

# Upload files using SCP (from your Mac)
scp -i ~/.ssh/macbook -r * username@your-domain.com:public_html/
```

## ⚙️ Step 3: Create Node.js Application in cPanel

1. In cPanel, find **"Node.js"** or **"Node.js Selector"**
2. Click **"Create Application"**
3. Configure:
   - **Node.js version**: Choose latest (18.x or 20.x)
   - **Application root**: `/home/username/public_html` (or your domain folder)
   - **Application URL**: Select your domain or subdomain
   - **Application startup file**: `server.js`
   - **Application mode**: Production
4. Click **"Create"**
5. **Note the port number** if shown (SiteGround may assign one automatically)

## 📥 Step 4: Install Dependencies

### Via SSH (Recommended):
```bash
# Connect via SSH
ssh -i ~/.ssh/macbook username@your-domain.com -p PORT

# Navigate to your app directory
cd public_html  # or your domain folder

# Install dependencies
npm install --production

# Create logs directory
mkdir -p logs
```

### Via cPanel Terminal:
1. In cPanel, open **Terminal**
2. Run the same commands as above

## 🎯 Step 5: Start the Application

### Using PM2 (Recommended):
```bash
# Install PM2 globally (if not already installed)
npm install -g pm2

# Start your app
pm2 start ecosystem.config.js

# Save PM2 configuration (so it restarts on server reboot)
pm2 save
pm2 startup
```

### Or using SiteGround Node.js Manager:
1. In **Node.js Selector**, find your application
2. Click **"Run Node.js App"** or **"Start"**

## ✅ Step 6: Test Your Live Site

1. Visit your domain: `https://your-domain.com`
2. Enter an Instagram username
3. Test the scraper!

## 🔍 Troubleshooting

### If the app doesn't start:
- Check Node.js version compatibility
- Verify all files were uploaded correctly
- Check logs: `pm2 logs instagram-scraper` or in SiteGround error logs

### If Puppeteer fails:
- SiteGround shared hosting may have limitations with Puppeteer
- Puppeteer needs to download Chromium on first install (may take time)
- Check if SiteGround allows headless browser automation
- Contact SiteGround support if Puppeteer won't work

### If you see errors:
- Check server logs: `pm2 logs` or SiteGround error logs
- Verify environment variables if needed
- Check port configuration

## 📝 Important Notes

1. **Puppeteer on Shared Hosting**: 
   - Puppeteer may not work on all shared hosting plans
   - SiteGround might restrict headless browser automation
   - If it doesn't work, you may need a VPS or dedicated server

2. **Resource Usage**:
   - Scraping uses significant resources
   - Monitor your server usage
   - Consider rate limiting if you get many requests

3. **SSL/HTTPS**:
   - Make sure your domain has SSL enabled
   - SiteGround usually provides free SSL

4. **Environment Variables**:
   - The app uses `process.env.PORT` for the port
   - SiteGround Node.js Selector usually handles this automatically

## 🎉 You're Done!

Your scraper should now be live! If you run into any issues, check:
- Server logs
- SiteGround's Node.js documentation
- Contact SiteGround support for hosting-specific issues

## 🔄 Updating Your App Later

```bash
# Connect via SSH
ssh -i ~/.ssh/macbook username@your-domain.com -p PORT

# Navigate to app directory
cd public_html

# Upload new files (via File Manager or SCP)

# Restart app
pm2 restart instagram-scraper
```

