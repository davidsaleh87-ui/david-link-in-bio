#!/bin/bash
# Start the link-in-bio server locally
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

pkill -f "node server.js" 2>/dev/null
echo "Starting link-in-bio server..."
cd "$(dirname "$0")"
node server.js &
echo "Running at http://localhost:3001"
