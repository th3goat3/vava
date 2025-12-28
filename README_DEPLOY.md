# Deployment Guide - SiteGround Doesn't Support Node.js

## 🚨 Issue

SiteGround shared hosting doesn't support Node.js applications.

## ✅ Solution: Use Free Node.js Hosting

Since your scraper needs Node.js + Puppeteer, use one of these **FREE** hosting services:

### Best Options:

1. **Render.com** (Recommended) - Easy, free, perfect for Node.js
2. **Railway.app** - Simple, free, great UI
3. **Fly.io** - Good for Puppeteer, more control
4. **Vercel** - Great for Node.js, easy GitHub integration

## Quick Deploy to Render.com (5 minutes)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Instagram scraper"
git branch -M main
# Create repo on GitHub, then:
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy on Render
1. Go to [render.com](https://render.com)
2. Sign up (free)
3. Click "New" → "Web Service"
4. Connect your GitHub repo
5. Render auto-detects Node.js
6. Click "Create Web Service"
7. Wait 2-3 minutes
8. **Your app is live!** 🎉

Your app will be at: `https://your-app-name.onrender.com`

### Step 3: Use Your Own Domain (Optional)
You can point your SiteGround domain to Render:
1. In SiteGround cPanel → DNS
2. Add CNAME: `@` → `your-app.onrender.com`
3. In Render, add your custom domain
4. Done!

## See `ALTERNATIVE_HOSTING.md` for detailed instructions!

