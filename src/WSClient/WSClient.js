import WebSocket from 'ws';
import Logger from "hermodlog";
import error from "hermodlog/src/methods/error.js";
class WSClient {
    constructor(props = {}) {
        this.host = props.host ?? 'localhost';
        this.port = props.port ?? 8090;

        this.id = `${this.host}:${this.port}`;

        this.socket = null;
        this.logger = props.logger ?? new Logger().context(`WSClient(${this.host}:${this.port})`);

        this.handlers = {};

        this.headers = props.headers ?? {};

        this.reconnectAttempts = 0;
    }

    async open() {
        return new Promise((resolve, reject) => {
                this.socket = new WebSocket(`ws://${this.host}:${this.port}`);
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
    close() {
        this.socket.close();
    }
    subscribe(room) {
        this.logger.method('subscribe()').info(`Subscribing to ${room}`)
        this.send({
            type: 'subscribe',
            payload: room
        })
    }

    authorize(_accessToken) {
        const accessToken = _accessToken ?? this.headers['access_token'];
        if (!accessToken) {
            throw new Error('Missing access_token')
        }
        this.send({
            type: 'authorize',
            payload: this.headers['access_token']
        })
    }

    send(message) {
        if(typeof message === 'object') {
            message = JSON.stringify(message);
        }
        this.socket.send(message);
    }

    addHandler(name, handler) {
        if (!this.handlers[name]) {
            this.handlers[name] = [];
        }
        this.handlers[name].push(handler);
    }
}

export default WSClient;
