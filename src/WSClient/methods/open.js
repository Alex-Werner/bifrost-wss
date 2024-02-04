import WebSocket from "ws";

export default async function open() {
    let hasConnectedOnce = false;
    this.status = 'connecting';
    return new Promise((resolve, reject) => {
        if (this.socket) {
            this.logger.info(`Already connected to ${this.id}`);
            return resolve(true);
        }
        const peerURI = (this.isSecure) ? `wss://${this.host}:${this.port}` : `ws://${this.host}:${this.port}`;
        this.socket = new WebSocket(peerURI);
        this.socket.addEventListener('open', () => {
            if(!hasConnectedOnce){
                hasConnectedOnce = true;
            }
            this.status = 'connected';
            this.logger.info(`Connected to ${this.id}`);
            if (this.handlers['open']) {
                this.handlers['open'].forEach((handler) => {
                    handler(this)
                });
            }
            resolve(true);
        });
        this.socket.addEventListener('message', (event) => {
            try{
                const message = JSON.parse(event.data);
                if (this.handlers['message']) {
                    this.handlers['message'].forEach((handler) => {
                        handler(message)
                    });
                }
                // Also check if there are topic handlers
                if (this.handlers[message.topic]) {
                    this.handlers[message.topic].forEach((handler) => {
                        handler(message)
                    });
                }

                // Check if there are any requests awaiting a response
                if (message.requestId && this.messageAwaitingResponses.has(message.requestId)) {
                    const { resolve, reject } = this.messageAwaitingResponses.get(message.requestId);
                    this.messageAwaitingResponses.delete(message.requestId);
                    resolve(message);
                }

            }catch (e){
                this.logger.error('Error in message handler', e);
            }
        });
        this.socket.addEventListener('error', (event) => {
            if (this.handlers['error']) {
                this.handlers['error'].forEach((handler) => {
                    handler(event)
                });
            }
            this.logger.error('===Error ' + JSON.stringify(event.error));

            if (typeof process !== 'undefined' && process.versions && process.versions.node) {
                // Node.js environment
                if (event.error) {
                    const { code } = event.error;
                    if (code === 'ECONNREFUSED') {
                        this.logger.info(`> Closing to ${this.id}`);
                        this.close();
                    } else {
                        reject(new Error(event.error));
                    }
                } else {
                    reject(new Error('An unknown error occurred'));
                }
            } else {
                // Browser environment as the event object does not contain error details at this point
                if(!hasConnectedOnce && this.status === 'connecting'){
                    // Probably a connection refused, peer not listening, etc.
                    reject(new Error(`Connection to ${peerURI} refused or impossible`));
                } else {
                    reject(new Error('WebSocket error occurred'));
                }
            }
        });

        this.socket.addEventListener('close', (event) => {
            // Upon close, try to reconnect
            this.logger.info(`Disconnected from ${this.id}`);
            if (this.handlers['close']) {
                this.handlers['close'].forEach((handler) => {
                    handler(event)
                });
            }
            const reconnectDelay = 1000 * (this.reconnectAttempts * 2);
            this.logger.info(`>Reconnecting to ${this.id} in ${reconnectDelay / 1000} seconds...`);
            this.close();

            setTimeout(()=>{
                this.reconnectAttempts++;
                this.open();
            }, reconnectDelay)
        })
    });
}
