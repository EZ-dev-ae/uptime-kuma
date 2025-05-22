const { MonitorType } = require("./monitor-type");
const { UP } = require("../../src/util");
const WebSocket = require("ws");
const dayjs = require("dayjs");

class WebSocketMonitorType extends MonitorType {
    name = "websocket";

    /**
     * Connect to the WebSocket server and mark the heartbeat as UP if the
     * connection can be established.
     * @param {Monitor} monitor monitor instance
     * @param {Heartbeat} heartbeat heartbeat instance
     * @param {UptimeKumaServer} _server server instance (unused)
     * @returns {Promise<void>}
     */
    async check(monitor, heartbeat, _server) {
        const startTime = dayjs().valueOf();
        let url = monitor.url || "";

        if (!url.startsWith("ws://") && !url.startsWith("wss://")) {
            const protocol = monitor.getIgnoreTls() ? "ws" : "wss";
            const host = monitor.hostname || "localhost";
            const port = monitor.port ? `:${monitor.port}` : "";
            url = `${protocol}://${host}${port}`;
        }

        await new Promise((resolve, reject) => {
            const ws = new WebSocket(url, {
                rejectUnauthorized: !monitor.getIgnoreTls(),
            });

            const timeout = setTimeout(() => {
                ws.terminate();
                reject(new Error("timeout"));
            }, monitor.timeout * 1000);

            ws.on("open", () => {
                clearTimeout(timeout);
                heartbeat.ping = dayjs().valueOf() - startTime;
                heartbeat.status = UP;
                heartbeat.msg = "Connected";
                ws.close();
                resolve();
            });

            ws.on("error", (err) => {
                clearTimeout(timeout);
                reject(err);
            });
        });
    }
}

module.exports = {
    WebSocketMonitorType,
};
