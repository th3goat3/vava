# Instagram Profile Scraper

A simple web application that allows users to enter an Instagram username and scrape the profile picture and follower count.

## Features

- 🖼️ Scrapes Instagram profile pictures
- 👥 Displays follower count
- 🎨 Modern, responsive UI
- ⚡ Fast and lightweight

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Install dependencies:
```bash
npm install
```

## Usage

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. Enter an Instagram username in the input field and click "Scrape"

## How It Works

- The backend uses Puppeteer to scrape Instagram profiles
- The frontend sends a POST request to `/api/scrape` with the username
- The server navigates to the Instagram profile page and extracts:
  - Profile picture URL
  - Follower count

## Notes

- Instagram may require login for some profiles
- Rate limiting may apply if making many requests
- This tool is for educational purposes only
- Please respect Instagram's Terms of Service

## Project Structure

```
.
├── server.js          # Express server with scraping logic
├── package.json       # Dependencies and scripts
├── public/
│   ├── index.html    # Frontend HTML
│   ├── style.css     # Styling
│   └── script.js     # Frontend JavaScript
└── README.md         # This file
```

## Deployment to SiteGround

For detailed deployment instructions to SiteGround hosting, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Quick Deployment Steps:

1. Upload all files to your SiteGround hosting (via cPanel File Manager or SSH)
2. Create a Node.js application in cPanel Node.js Selector
3. Install dependencies: `npm install --production`
4. Start with PM2: `pm2 start ecosystem.config.js`
5. Your app should be running!

## License

ISC

