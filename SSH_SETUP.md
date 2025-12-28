# SSH Key Setup for SiteGround on Mac

This guide will help you set up SSH keys to connect to your SiteGround hosting.

## Method 1: Generate a New SSH Key Pair (Recommended)

1. **Generate a new SSH key pair:**
   ```bash
   ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
   ```

2. **When prompted, press Enter to accept the default location** (`~/.ssh/id_rsa`):
   ```
   Enter file in which to save the key (/Users/yourusername/.ssh/id_rsa): [Press Enter]
   ```

3. **Enter a passphrase** (optional but recommended):
   ```
   Enter passphrase (empty for no passphrase): [Enter passphrase or press Enter for none]
   ```

4. **Your key pair will be created:**
   - Private key: `~/.ssh/id_rsa`
   - Public key: `~/.ssh/id_rsa.pub`

5. **Copy your public key to SiteGround:**
   ```bash
   cat ~/.ssh/id_rsa.pub
   ```
   Copy the output and add it to SiteGround cPanel → SSH/Shell Access → Authorized Keys

## Method 2: Save an Existing Private Key

If you already have a private key file, you need to save it properly:

1. **Create the .ssh directory if it doesn't exist:**
   ```bash
   mkdir -p ~/.ssh
   chmod 700 ~/.ssh
   ```

2. **Copy your private key file to the .ssh directory:**
   ```bash
   # If your key file is on Desktop:
   cp ~/Desktop/your_private_key ~/.ssh/id_rsa
   
   # OR if you're pasting it:
   nano ~/.ssh/id_rsa
   # Paste your key, then press Ctrl+X, then Y, then Enter to save
   ```

3. **Set proper permissions on the private key:**
   ```bash
   chmod 600 ~/.ssh/id_rsa
   ```

4. **Test the connection:**
   ```bash
   ssh -i ~/.ssh/id_rsa username@your-domain.com
   ```

## Method 3: If You're Getting "Cannot open file for writing"

If you're seeing this error, try these solutions:

### Solution A: Use Full Path
```bash
# Instead of relative path, use full path:
ssh-keygen -t rsa -b 4096 -f /Users/yourusername/.ssh/id_rsa
```

### Solution B: Create Directory First
```bash
# Create the directory first:
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Then generate the key:
ssh-keygen -t rsa -b 4096
```

### Solution C: Check Permissions
```bash
# Check if directory exists and has correct permissions:
ls -la ~ | grep .ssh

# If it doesn't exist or has wrong permissions:
mkdir -p ~/.ssh
chmod 700 ~/.ssh
```

### Solution D: Use nano/vim to Create File
```bash
# Create the directory:
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Create the key file using a text editor:
nano ~/.ssh/id_rsa
# Paste your private key content
# Press Ctrl+X, then Y, then Enter to save

# Set proper permissions:
chmod 600 ~/.ssh/id_rsa
```

## Common Issues and Fixes

### Issue: "Permission denied (publickey)"
**Solution:**
1. Make sure your public key is added to SiteGround's authorized keys
2. Check file permissions:
   ```bash
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/id_rsa
   ```

### Issue: "Could not open a connection to your authentication agent"
**Solution:**
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
```

### Issue: Multiple SSH Keys
If you have multiple keys, create/edit `~/.ssh/config`:
```bash
nano ~/.ssh/config
```

Add:
```
Host siteground
    HostName your-domain.com
    User your_username
    IdentityFile ~/.ssh/id_rsa
    IdentitiesOnly yes
```

Then connect with:
```bash
ssh siteground
```

## SiteGround Specific Steps

1. **Enable SSH in SiteGround cPanel:**
   - Log into cPanel
   - Go to "SSH/Shell Access" or "Advanced" → "SSH Access"
   - Enable SSH access if not already enabled

2. **Add Your Public Key:**
   - In SSH/Shell Access, click "Manage SSH Keys"
   - Click "Import Key" or "Add New Key"
   - Paste your public key (`cat ~/.ssh/id_rsa.pub` to view it)
   - Save and authorize the key
   - **Note:** If you only have a private key, you need to get the corresponding public key. For OpenSSH format keys, you can extract it or generate a new key pair.

3. **Get Your SSH Credentials:**
   - Username: Usually your cPanel username
   - Host: Your domain or server hostname (check cPanel → SSH Access)
   - Port: Usually 18765 or 2222 (check in cPanel)

4. **Connect using your saved key:**
   ```bash
   # Using the key directly:
   ssh -i ~/.ssh/macbook username@your-domain.com -p 18765
   
   # Or if you've set up SSH config (see below):
   ssh siteground
   ```

5. **Optional: Set up SSH config for easier connection:**
   
   Edit `~/.ssh/config`:
   ```bash
   nano ~/.ssh/config
   ```
   
   Add:
   ```
   Host siteground
       HostName your-domain.com
       User your_username
       Port 18765
       IdentityFile ~/.ssh/macbook
       IdentitiesOnly yes
   ```
   
   Replace `your-domain.com`, `your_username`, and `18765` with your actual values from SiteGround cPanel.
   
   Then connect simply with:
   ```bash
   ssh siteground
   ```

## Verify Setup

Test your SSH connection:
```bash
ssh -v username@your-domain.com
```

The `-v` flag shows verbose output to help debug connection issues.

## Need Help?

- Check SiteGround's SSH documentation
- Contact SiteGround support for SSH access details
- Verify your SSH keys are correctly formatted (should start with `-----BEGIN` and end with `-----END`)

