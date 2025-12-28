# Quick SSH Connection Guide for SiteGround

Your private key has been saved to: `~/.ssh/macbook`

## Next Steps

### 1. Get Your Public Key

You need to add your **public key** to SiteGround. If you have it, it should look like:
```
ssh-ed25519 AAAA... (long string of characters)
```

**If you don't have the public key**, try extracting it:
```bash
ssh-keygen -y -f ~/.ssh/macbook
```
(Note: This will only work if your private key is NOT password-protected)

### 2. Add Public Key to SiteGround

1. Log into SiteGround cPanel
2. Go to **SSH/Shell Access** or **Advanced** → **SSH Access**
3. Click **Manage SSH Keys** or **Import Key**
4. Paste your public key
5. Click **Authorize** or **Save**

### 3. Get Your SSH Connection Details

From SiteGround cPanel → SSH Access, note:
- **Username**: (usually your cPanel username)
- **Host**: (your domain or server hostname)
- **Port**: (usually 18765 or 2222)

### 4. Connect to SiteGround

**Option A: Direct connection**
```bash
ssh -i ~/.ssh/macbook username@your-domain.com -p 18765
```

**Option B: Using SSH config (easier)**

Edit the config file:
```bash
nano ~/.ssh/config
```

Find the `Host siteground` section and update it with your actual details:
```
Host siteground
    HostName your-domain.com          # Replace with your actual domain
    User your_username                # Replace with your cPanel username
    Port 18765                        # Replace with your port from cPanel
    IdentityFile ~/.ssh/macbook
    IdentitiesOnly yes
```

Save and exit (Ctrl+X, then Y, then Enter).

Then connect simply with:
```bash
ssh siteground
```

## Troubleshooting

**"Permission denied (publickey)":**
- Make sure you've added the public key to SiteGround
- Verify key permissions: `chmod 600 ~/.ssh/macbook`
- Check that you're using the correct username

**"Connection refused":**
- Verify the port number in cPanel
- Make sure SSH access is enabled in SiteGround
- Check that your IP isn't blocked

**"Host key verification failed":**
- Remove old host key: `ssh-keygen -R your-domain.com`
- Or accept the new key when prompted

## Quick Test

Test your connection:
```bash
ssh -v -i ~/.ssh/macbook username@your-domain.com -p 18765
```

The `-v` flag shows detailed connection information.

