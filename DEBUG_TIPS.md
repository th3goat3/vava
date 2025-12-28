# Debugging Tips

## Check Server Logs

When you get a 500 error, check your terminal where the server is running. You should see:
- "Starting scrape for: [username]"
- "Navigating to: [url]"
- "Extracting profile data..."
- Any error messages

## Common Issues

### 500 Internal Server Error

This means the server is responding but there's an error. Common causes:

1. **Puppeteer can't launch browser**
   - Check if Chrome/Chromium is installed
   - On Mac, this should work automatically
   - Try: `npm install puppeteer --force` to reinstall

2. **Instagram blocking requests**
   - Instagram may be detecting automated requests
   - Try different usernames
   - Check if you can access Instagram normally in browser

3. **Timeout issues**
   - The request times out after 20 seconds
   - Check server logs for timeout messages

### Socket Hang Up

This was fixed with timeout handling. If you still see it:
- Check server logs
- Restart the server
- Check network connectivity

## View Detailed Errors

Open browser console (F12) and Network tab to see:
- Request/response details
- Error messages from server
- Status codes

## Test Server Directly

You can test the endpoint with curl:

```bash
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"username":"instagram"}'
```

## Check Server Terminal

Always check the terminal where `npm start` is running for detailed error logs.

