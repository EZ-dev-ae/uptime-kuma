# OCPP Monitor Prototype

This prototype adds a custom health check for OCPP WebSocket endpoints.

- **ADR-001** documents architecture and design decisions.
- **ocpp-probe.js** implements a minimal charge point that performs BootNotification and Heartbeat exchange. Exit code reflects health.
- **docker-compose.yml** shows how to mount the probe when running Kuma via Docker (optional).
- **tests/README** describes failure scenarios and how to run the probe manually.

Use the provided monitor JSON example to integrate with Uptime-Kuma. Alerts trigger whenever the probe fails or misses the heartbeat.

If you run Uptime-Kuma directly with `node server/server.js`, copy `custom-monitors/ocpp-probe.js` to the `custom-monitors` folder and add an **Exec** monitor in the UI. Set `WS_URL` and other parameters in the monitor's environment variable section.

