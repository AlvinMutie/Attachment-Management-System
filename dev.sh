#!/bin/bash
# Start the AttachPro backend and Flutter student app for development.
# Usage: ./dev.sh
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$SCRIPT_DIR/server"
MOBILE_DIR="$SCRIPT_DIR/mobile"

echo "=================================="
echo " AttachPro Development Launcher"
echo "=================================="

# Start backend server in background
echo "[1/2] Starting AttachPro backend on port 5000..."
cd "$SERVER_DIR"
nohup node index.js > /tmp/attachpro-server.log 2>&1 &
SERVER_PID=$!
echo "    Backend PID: $SERVER_PID"
echo "    Logs: /tmp/attachpro-server.log"

# Wait for server to boot
sleep 3
if ! ss -tlnp | grep -q ':5000'; then
  echo "    WARNING: Backend may not have started. Check /tmp/attachpro-server.log"
fi

# Run Flutter app
echo "[2/2] Starting Flutter student app (Chrome for web dev testing)..."
cd "$MOBILE_DIR"
echo ""
echo "    To run on Chrome:"
echo "      flutter run -d chrome --web-hostname 127.0.0.1 --web-port 8080"
echo ""
echo "    To run on Android (physical device or emulator):"
echo "      flutter run -d <device-id>"
echo ""
echo "    To build APK:"
echo "      flutter build apk --split-per-abi"
echo ""
echo "    Backend API base URL for Android emulator: http://10.0.2.2:5000"
echo "    Backend API base URL for physical device:  http://<your-machine-ip>:5000"
echo ""
echo "    Current API_BASE_URL logic (auto-detected in api_constants.dart):"
echo "      Android emulator → http://10.0.2.2:5000"
echo "      Web/Desktop       → http://127.0.0.1:5000"
echo ""
echo "=================================="
