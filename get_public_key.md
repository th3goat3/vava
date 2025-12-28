# Extract Your Public Key

Your private key is saved at: `~/.ssh/macbook`

## Extract the Public Key

Run this command in your terminal (it will prompt you for the password):

```bash
ssh-keygen -y -f ~/.ssh/macbook > ~/.ssh/macbook.pub
```

**When prompted for the passphrase, enter:** `@@ITsnot2020`

After it completes, view your public key:

```bash
cat ~/.ssh/macbook.pub
```

The output will look something like:
```
ssh-ed25519 AAAA... (a long string of characters)
```

## Then Add to SiteGround

1. Copy the entire public key output (the line starting with `ssh-ed25519`)
2. Log into SiteGround cPanel
3. Go to **SSH/Shell Access** → **Manage SSH Keys**
4. Click **Import Key** or **Add New Key**
5. Paste the public key
6. Save and **Authorize** the key

## Quick One-Liner to View Public Key

After extraction, you can also view and copy it with:

```bash
cat ~/.ssh/macbook.pub | pbcopy  # Copies to clipboard on Mac
```

Then paste it into SiteGround.

