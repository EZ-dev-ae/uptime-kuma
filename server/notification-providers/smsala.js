const NotificationProvider = require("./notification-provider");
const axios = require("axios");

class SMSala extends NotificationProvider {
    name = "SMSala";

    /**
     * @inheritdoc
     */
    async send(notification, msg, monitorJSON = null, heartbeatJSON = null) {
        const okMsg = "Sent Successfully.";
        const url = "https://api2.smsala.com/SendSmsV2";

        try {
            let params = new URLSearchParams();
            params.append("apiToken", notification.smsalaApiToken);
            params.append("messageType", notification.smsalaMessageType || "1");
            params.append("messageEncoding", notification.smsalaMessageEncoding || "1");
            params.append("destinationAddress", notification.smsalaTo);
            params.append("sourceAddress", notification.smsalaFrom);
            params.append("messageText", msg);

            await axios.get(`${url}?${params.toString()}`);

            return okMsg;
        } catch (error) {
            this.throwGeneralAxiosError(error);
        }
    }
}

module.exports = SMSala;
