# Next Steps: Add SSH Key to SiteGround

## ✅ Your Keys Are Ready

- **Private key**: `~/.ssh/macbook` (saved, permissions set)
- **Public key**: `~/.ssh/macbook.pub` (saved)

## Add Public Key to SiteGround

1. **Log into SiteGround cPanel**
   - Go to your SiteGround account
   - Access cPanel

2. **Navigate to SSH Access**
   - Look for **"SSH/Shell Access"** or **"Advanced"** → **"SSH Access"**
   - Click on it

3. **Manage SSH Keys**
   - Click **"Manage SSH Keys"** or **"Import Key"**
   - Click **"Import Key"** or **"Add New Key"**

4. **Paste Your Public Key**
   - **Key Name**: `macbook` (or any name you prefer)
   - **Public Key**: Paste this:
     ```
     ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDkGSYuCim8sSDuq6VK1tawFCYic7l6zGqz/kpW9eCAR
     ```
   - Click **"Import"** or **"Save"**

5. **Authorize the Key**
   - Find your key in the list
   - Click **"Authorize"** button (this is important!)
   - The key status should change to "Authorized"

## Get Your SSH Connection Details

From SiteGround cPanel → SSH Access, note down:
- **Username**: (usually your cPanel username, like `username` or `user@domain`)
- **Host/Hostname**: (your domain or server hostname like `yoursite.com` or `serverXX.siteground.com`)
- **Port**: (usually `18765` or `2222` - check in cPanel)

## Connect to SiteGround

### Option 1: Direct Connection

```bash
ssh -i ~/.ssh/macbook username@your-domain.com -p 18765
```

Replace:
- `username` with your cPanel username
- `your-domain.com` with your hostname from cPanel
- `18765` with your actual port

### Option 2: Using SSH Config (Recommended)

Edit your SSH config for easier connection:

```bash
nano ~/.ssh/config
```

Add or update this section:

```
Host siteground
    HostName your-domain.com              # Your hostname from SiteGround
    User your_username                    # Your cPanel username
    Port 18765                           # Your port from SiteGround
    IdentityFile ~/.ssh/macbook
    IdentitiesOnly yes
```

Save and exit (Ctrl+X, then Y, then Enter).

Then connect simply with:

```bash
ssh siteground
```

When prompted for the passphrase, enter: `@@ITsnot2020`

## Test Connection

Test your connection:

```bash
ssh -v -i ~/.ssh/macbook username@your-domain.com -p 18765
```

If successful, you'll see a welcome message and command prompt.

## Quick Copy Commands

To quickly view and copy your public key:

```bash
# View public key
cat ~/.ssh/macbook.pub

# Copy to clipboard (Mac)
cat ~/.ssh/macbook.pub | pbcopy
```

## Troubleshooting

**"Permission denied (publickey)":**
- Verify you clicked "Authorize" on the key in SiteGround
- Check that you're using the correct username
- Ensure the public key was pasted correctly (no extra spaces or line breaks)

**"Connection refused":**
- Verify the port number is correct
- Check that SSH access is enabled in SiteGround
- Contact SiteGround support if needed

**"Host key verification failed":**
```bash
ssh-keygen -R your-domain.com
```
Then try connecting again.

## Once Connected

After successfully connecting, you can:
1. Navigate to your application directory
2. Install Node.js dependencies: `npm install --production`
3. Start your Instagram scraper app
4. See `DEPLOYMENT.md` for full deployment instructions

