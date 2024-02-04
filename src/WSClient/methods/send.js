import {generateNonce} from "../utils/generateRequestId.js";

export default async function send(message) {
    return new Promise((resolve, reject) => {
        if (typeof message === 'object') {
            if (message.cmd) {
                // random uuid for request id
                message.requestId = message.requestId ?? generateNonce();
                // We will wait for a response with this requestId to resolve the promise
                this.messageAwaitingResponses.set(message.requestId, { resolve, reject });
            }
            message = JSON.stringify(message);
        }
        if (!this.socket) {
            throw new Error('Socket not connected');
        }
        this.socket.send(message);
    });
};
