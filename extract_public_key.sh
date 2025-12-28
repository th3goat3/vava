#!/bin/bash
# Script to extract public key from private key
# Run this script and enter your password: @@ITsnot2020

echo "Extracting public key from ~/.ssh/macbook"
echo "You will be prompted for the passphrase. Enter: @@ITsnot2020"
echo ""

ssh-keygen -y -f ~/.ssh/macbook > ~/.ssh/macbook.pub

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Public key extracted successfully!"
    echo ""
    echo "Your public key (save this to SiteGround):"
    echo "----------------------------------------"
    cat ~/.ssh/macbook.pub
    echo "----------------------------------------"
    echo ""
    echo "Public key saved to: ~/.ssh/macbook.pub"
    echo ""
    echo "Next step: Copy the public key above and add it to SiteGround cPanel → SSH → Manage SSH Keys"
else
    echo "Error extracting public key. Please check the password."
fi

