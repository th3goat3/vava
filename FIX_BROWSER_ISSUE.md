# Fix Browser Launch Issue

The error "socket hang up" during browser launch means Puppeteer can't connect to Chrome/Chromium.

## Quick Fix

Try reinstalling Puppeteer to ensure Chromium is properly downloaded:

```bash
npm install puppeteer --force
```

Or remove and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Alternative: Use System Chrome

If the above doesn't work, you can configure Puppeteer to use your system's Chrome instead:

Edit `server.js` and change the browser launch to:

```javascript
browser = await puppeteer.launch({
  headless: true,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // Mac
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage'
  ],
  timeout: 20000
});
```

For other systems, find your Chrome path:
- Mac: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
- Linux: `/usr/bin/google-chrome` or `/usr/bin/chromium-browser`
- Windows: `C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe`

## Test Browser Launch

You can test if Puppeteer works with:

```javascript
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  console.log('Browser launched successfully!');
  await browser.close();
})();
```

Run: `node -e "const puppeteer = require('puppeteer'); (async () => { const b = await puppeteer.launch({ headless: true }); console.log('OK'); await b.close(); })();"`

