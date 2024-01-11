import WebSocket from "ws";

export default async function open() {
    return new Promise((resolve, reject) => {
        const peerURI = (this.isSecure) ? `wss://${this.host}:${this.port}` : `ws://${this.host}:${this.port}`;
        this.socket = new WebSocket(peerURI);
        this.socket.addEventListener('open', () => {
            this.logger.info(`Connected to ${this.id}`);
            if (this.handlers['open']) {
                this.handlers['open'].forEach((handler) => {
                    handler(this)
                });
            }
            resolve(true);
        });
        this.socket.addEventListener('message', (event) => {
            if (this.handlers['message']) {
                this.handlers['message'].forEach((handler) => {
                    handler(event)
                });
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
                reject(new Error('WebSocket error occurred'));
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
        // this.socket.addEventListener('error', (event) => {
        //     this.logger.error(`Error ${event.message}`);
        //     if (this.handlers['error']) {
        //         this.handlers['error'].forEach((handler) => {
        //             handler(event)
        //         });
        //     }
        //     this.logger.info(`Reconnecting to ${this.id}`);
        //     this.close();
        // })
    });
}
