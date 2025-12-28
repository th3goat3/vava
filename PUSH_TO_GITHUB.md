# Push Code to GitHub Repository

Follow these steps to push your Instagram scraper to GitHub:

## Step 1: Initialize Git (if not already done)

```bash
cd "/Users/hicham/Desktop/simple scrapper"
git init
```

## Step 2: Add All Files

```bash
git add .
```

This will add all files except those in `.gitignore` (like `node_modules`).

## Step 3: Make Your First Commit

```bash
git commit -m "Initial commit: Instagram profile scraper"
```

## Step 4: Add Your GitHub Repository as Remote

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

**Or if you're using SSH:**
```bash
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
```

## Step 5: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

You'll be prompted for your GitHub username and password (or personal access token).

---

## Quick Copy-Paste Commands

**Replace `YOUR_USERNAME/YOUR_REPO_NAME` with your actual repository URL:**

```bash
cd "/Users/hicham/Desktop/simple scrapper"
git init
git add .
git commit -m "Initial commit: Instagram profile scraper"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## If You Get Authentication Errors

If you see authentication errors, you may need to:

1. **Use a Personal Access Token** (recommended):
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token (classic)
   - Give it `repo` permissions
   - Use the token as your password when pushing

2. **Or set up SSH keys:**
   ```bash
   # Check if you have SSH key
   ls -la ~/.ssh/id_rsa.pub
   
   # If not, generate one:
   ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
   
   # Add to GitHub:
   cat ~/.ssh/id_rsa.pub
   # Copy the output and add it to GitHub → Settings → SSH and GPG keys
   ```

---

## Verify Your Push

After pushing, check your GitHub repository - you should see all your files there!

---

## Need Help?

If you need help with any step, just let me know! Share your repository URL if you want me to help you with the exact commands.

