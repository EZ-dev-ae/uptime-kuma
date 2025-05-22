# Test Plan

The prototype assumes a running OCPP Central System simulator. Three failure scenarios should be exercised:

1. **TCP Down** – simulator not listening. The probe should fail to connect and Kuma reports down immediately.
2. **WebSocket Upgrade OK but Heartbeat Missing** – server accepts the socket but does not answer the Heartbeat. The probe exits after `HEARTBEAT_TIMEOUT` (~30s).
3. **OCPP Reject** – server returns a BootNotification with status `Rejected`. The script exits non‑zero instantly.

Configure monitor interval to 30 seconds so mean time to detect is below one minute.

Run the probe manually (no Docker needed) with:
```bash
WS_URL=wss://localhost/ocpp OCPP_VERSION=1.6 node custom-monitors/ocpp-probe.js

When Kuma is started with `node server/server.js`, place the script in `custom-monitors/` and add an Exec monitor via the UI.
```

