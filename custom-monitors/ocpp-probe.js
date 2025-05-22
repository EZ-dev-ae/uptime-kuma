#!/usr/bin/env node

const WebSocket = require('ws');
const { randomUUID } = require('crypto');
let ocpp;
try {
    ocpp = require('ocpp-rpc');
} catch (err) {
    ocpp = {};
}

const {
    WS_URL,
    OCPP_VERSION = '1.6',
    CHARGE_POINT_MODEL = 'kuma-probe',
    HEARTBEAT_TIMEOUT = '30000'
} = process.env;

if (!WS_URL) {
    console.error(JSON.stringify({ error: 'WS_URL env var not set' }));
    process.exit(1);
}

const SUB_PROTOCOL = OCPP_VERSION.startsWith('2') ? 'ocpp2.0.1' : 'ocpp1.6';

function packCall(id, action, payload) {
    if (ocpp.packCallMessage) {
        return JSON.stringify(ocpp.packCallMessage(id, action, payload));
    }
    return JSON.stringify([2, id, action, payload]);
}

function parseMessage(data) {
    try {
        if (ocpp.parseMessage) {
            return ocpp.parseMessage(data);
        }
        return JSON.parse(data);
    } catch (err) {
        return null;
    }
}

function waitForMessage(ws, id, timeout) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            ws.removeListener('message', onMessage);
            reject(new Error('timeout'));
        }, timeout);

        function onMessage(data) {
            const msg = parseMessage(data);
            if (Array.isArray(msg) && msg[1] === id) {
                clearTimeout(timer);
                ws.removeListener('message', onMessage);
                resolve(msg);
            }
        }

        ws.on('message', onMessage);
    });
}

async function run() {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(WS_URL, SUB_PROTOCOL);

        ws.on('error', err => {
            reject(err);
        });

        ws.on('open', async () => {
            try {
                const bootId = randomUUID();
                let payload;
                if (SUB_PROTOCOL === 'ocpp2.0.1') {
                    payload = {
                        chargingStation: { model: CHARGE_POINT_MODEL, vendorName: 'Kuma' },
                        reason: 'PowerUp'
                    };
                } else {
                    payload = {
                        chargePointModel: CHARGE_POINT_MODEL,
                        chargePointVendor: 'Kuma'
                    };
                }
                const bootMsg = packCall(bootId, 'BootNotification', payload);
                ws.send(bootMsg);
                const bootResp = await waitForMessage(ws, bootId, parseInt(HEARTBEAT_TIMEOUT));
                if (!bootResp[2] || bootResp[2].status !== 'Accepted') {
                    throw new Error('boot_rejected');
                }

                const hbId = randomUUID();
                const hbMsg = packCall(hbId, 'Heartbeat', {});
                const sendTime = Date.now();
                ws.send(hbMsg);
                await waitForMessage(ws, hbId, parseInt(HEARTBEAT_TIMEOUT));
                const rtt = Date.now() - sendTime;
                ws.close(1000);
                resolve(rtt);
            } catch (err) {
                ws.close();
                reject(err);
            }
        });
    });
}

run().then(rtt => {
    console.log(JSON.stringify({ status: 'ok', rtt }));
    process.exit(0);
}).catch(err => {
    console.error(JSON.stringify({ error: err.message }));
    process.exit(2);
});

