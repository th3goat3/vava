# SiteGround Deployment Guide

This guide will help you deploy the Instagram Scraper to SiteGround hosting.

## Prerequisites

- SiteGround hosting account with Node.js support
- SSH access to your SiteGround account
- cPanel access

## Step 1: Prepare Your Files

1. Make sure all files are ready locally
2. Compress all files (excluding `node_modules`) into a `.zip` file if uploading via cPanel File Manager

## Step 2: Upload Files to SiteGround

### Option A: Using cPanel File Manager

1. Log into your SiteGround cPanel
2. Navigate to **File Manager**
3. Go to your domain's root directory (usually `public_html` or a subdomain folder)
4. Upload all project files (extract if you zipped them)
5. Make sure the structure looks like:
   ```
   your-domain/
   ├── server.js
   ├── package.json
   ├── ecosystem.config.js
   ├── public/
   │   ├── index.html
   │   ├── style.css
   │   └── script.js
   └── ...
   ```

### Option B: Using SSH/SCP

1. Connect to your SiteGround account via SSH:
   ```bash
   ssh username@your-domain.com
   ```
2. Navigate to your domain directory
3. Upload files using SCP or SFTP client

## Step 3: Install Node.js Application in cPanel

1. In cPanel, find **Node.js** or **Node.js Selector** app
2. Click **Create Application**
3. Configure:
   - **Node.js version**: Select the latest LTS version (e.g., 18.x or 20.x)
   - **Application root**: `/home/username/public_html` (or your domain folder)
   - **Application URL**: Choose your domain or subdomain
   - **Application startup file**: `server.js`
   - **Application mode**: Production
4. Note the port number assigned (SiteGround will show this)

## Step 4: Install Dependencies

### Using SSH:

1. Connect via SSH:
   ```bash
   ssh username@your-domain.com
   ```

2. Navigate to your application directory:
   ```bash
   cd public_html  # or your app directory
   ```

3. Install dependencies:
   ```bash
   npm install --production
   ```

4. Create logs directory:
   ```bash
   mkdir -p logs
   ```

### Using cPanel Terminal:

1. In cPanel, open **Terminal**
2. Run the same commands as above

## Step 5: Start the Application

### Using PM2 (Recommended):

1. Install PM2 globally if not already installed:
   ```bash
   npm install -g pm2
   ```

2. Start the application:
   ```bash
   pm2 start ecosystem.config.js
   ```

3. Save PM2 configuration:
   ```bash
   pm2 save
   pm2 startup
   ```

### Using SiteGround Node.js Manager:

1. In the Node.js Selector, click **Run Node.js App**
2. The app should start automatically

## Step 6: Update Frontend API URL

If your app is running on a specific port or subdomain, update the frontend to point to the correct URL:

1. Edit `public/script.js`
2. Update the fetch URL if needed (it should work automatically if using the same domain)

The frontend uses a relative URL (`/api/scrape`), so it should work automatically if deployed on the same domain.

## Step 7: Configure Environment Variables (Optional)

If you need to set a custom port:

1. In SiteGround Node.js Selector, add environment variable:
   - Key: `PORT`
   - Value: (the port assigned by SiteGround, or leave empty for auto-detect)

## Step 8: Test Your Application

1. Visit your domain in a browser
2. Enter an Instagram username and test the scraper
3. Check the logs if there are any issues:
   ```bash
   pm2 logs instagram-scraper
   ```

## Troubleshooting

### Application Won't Start

- Check Node.js version compatibility
- Verify all dependencies are installed: `npm install`
- Check logs: `pm2 logs` or in SiteGround error logs
- Ensure port is correctly configured

### Puppeteer Issues

- Puppeteer may need additional dependencies on Linux servers
- SiteGround might have restrictions on browser automation
- Contact SiteGround support if Puppeteer fails to launch

### Memory Issues

- Adjust `max_memory_restart` in `ecosystem.config.js`
- Consider reducing Puppeteer instances
- Contact SiteGround about memory limits

### Port Issues

- SiteGround assigns ports automatically for Node.js apps
- Don't hardcode port numbers
- Use environment variable `PORT`

## Important Notes

1. **Resource Limits**: Puppeteer can be resource-intensive. Monitor your server resources
2. **Rate Limiting**: Instagram may rate-limit requests. Implement delays if needed
3. **Terms of Service**: Ensure compliance with Instagram's ToS
4. **Backup**: Always backup your files before deploying

## Updating the Application

1. Upload new files via cPanel or SSH
2. SSH into server:
   ```bash
   cd /path/to/your/app
   npm install  # if dependencies changed
   pm2 restart instagram-scraper
   ```

## Monitoring

- View logs: `pm2 logs instagram-scraper`
- Monitor processes: `pm2 status`
- View app info: `pm2 info instagram-scraper`

## Support

If you encounter issues:
1. Check SiteGround's Node.js documentation
2. Review application logs
3. Contact SiteGround support for hosting-specific issues



