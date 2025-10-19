#!/bin/bash

# Launch Chrome with remote debugging enabled for Browser MCP
# This script makes it easy to start Chrome in debug mode

echo "🚀 Launching Chrome with remote debugging on port 9222..."

# Kill any existing Chrome instances on port 9222
lsof -ti:9222 | xargs kill -9 2>/dev/null

# Launch Chrome Beta with remote debugging
/Applications/Google\ Chrome\ Beta.app/Contents/MacOS/Google\ Chrome\ Beta \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-debug-profile \
  --no-first-run \
  --no-default-browser-check \
  > /dev/null 2>&1 &

# Wait a moment for Chrome to start
sleep 2

# Check if Chrome is listening on port 9222
if lsof -i :9222 > /dev/null 2>&1; then
  echo "✅ Chrome is now listening on port 9222"
  echo "✅ Browser MCP can now connect"
  echo ""
  echo "📝 Chrome is using a temporary profile at: /tmp/chrome-debug-profile"
  echo "🌐 Navigate to: http://localhost:5678"
else
  echo "❌ Failed to start Chrome on port 9222"
  echo "Please check if Chrome Beta is installed at:"
  echo "/Applications/Google Chrome Beta.app"
fi

