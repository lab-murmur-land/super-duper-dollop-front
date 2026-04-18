#!/bin/bash

echo "[1/4] Preparing Systemd User Environment..."
SERVICE_DIR="${HOME}/.config/systemd/user"
mkdir -p "$SERVICE_DIR"

SERVICE_FILE="${SERVICE_DIR}/terminal-noir.service"
WORK_DIR=$(pwd)
NPM_PATH=$(which npm)

if [ -z "$NPM_PATH" ]; then
    echo "ERROR: 'npm' not found in PATH! Please ensure Node.js is installed."
    exit 1
fi

echo "[2/4] Generating terminal-noir.service file..."
cat <<EOF > "$SERVICE_FILE"
[Unit]
Description=Terminal Noir Express Server
After=network.target

[Service]
Type=simple
WorkingDirectory=${WORK_DIR}
ExecStart=${NPM_PATH} start
Restart=on-failure
RestartSec=5
Environment=PATH=${PATH}

[Install]
WantedBy=default.target
EOF

echo "      -> Created at $SERVICE_FILE"

echo "[3/4] Enabling and Starting Service..."
systemctl --user daemon-reload
systemctl --user enable terminal-noir.service
systemctl --user restart terminal-noir.service

echo "[4/4] Installation Complete!"
echo "----------------------------------------------------"
echo "Your Express server is now running in the background as a user service."
echo ""
echo "Helpful Commands:"
echo "  Check Status:  systemctl --user status terminal-noir.service"
echo "  Stop Server:   systemctl --user stop terminal-noir.service"
echo "  Start Server:  systemctl --user start terminal-noir.service"
echo "  View Logs:     journalctl --user -u terminal-noir.service -f"
echo "----------------------------------------------------"
