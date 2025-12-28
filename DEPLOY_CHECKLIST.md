# SiteGround Deployment Checklist

Use this checklist to deploy your Instagram Scraper to SiteGround.

## Pre-Deployment

- [ ] All files are ready locally
- [ ] Tested the application locally (`npm start`)
- [ ] Verified all dependencies are in `package.json`

## Upload Files

- [ ] Logged into SiteGround cPanel
- [ ] Navigated to File Manager
- [ ] Uploaded all files to your domain directory (`public_html` or subdomain folder)
- [ ] Verified file structure is correct:
  - [ ] `server.js` exists
  - [ ] `package.json` exists
  - [ ] `ecosystem.config.js` exists
  - [ ] `public/` folder exists with `index.html`, `style.css`, `script.js`

## Node.js Setup

- [ ] Found "Node.js" or "Node.js Selector" in cPanel
- [ ] Created new Node.js application
- [ ] Selected Node.js version (18.x or 20.x recommended)
- [ ] Set application root to your domain folder
- [ ] Set startup file to `server.js`
- [ ] Noted the assigned port number (if shown)

## Install Dependencies

- [ ] Opened SSH/Terminal in cPanel or connected via SSH
- [ ] Navigated to your app directory
- [ ] Ran `npm install --production`
- [ ] Created logs directory: `mkdir -p logs`

## Start Application

- [ ] Installed PM2 globally (if needed): `npm install -g pm2`
- [ ] Started app: `pm2 start ecosystem.config.js`
- [ ] Saved PM2 config: `pm2 save`
- [ ] Verified app is running: `pm2 status`

## Test

- [ ] Visited your domain in browser
- [ ] Page loads correctly
- [ ] Entered a test Instagram username
- [ ] Scraping works and displays results

## If Issues Occur

- [ ] Checked PM2 logs: `pm2 logs instagram-scraper`
- [ ] Verified Node.js app is running in cPanel
- [ ] Checked SiteGround error logs
- [ ] Verified port configuration
- [ ] Contacted SiteGround support if needed

## Notes

- Port is automatically assigned by SiteGround (check Node.js Selector)
- App should auto-restart if it crashes (PM2 handles this)
- Monitor memory usage if scraping many profiles
- Consider rate limiting to avoid Instagram blocking



