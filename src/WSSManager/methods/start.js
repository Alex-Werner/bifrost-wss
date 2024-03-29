import * as WebSocket from 'ws';
import WSPeer from "../../WSPeer/WSPeer.js";
import parseRawMessage from "../../utils/parseRawMessage.js";
async function start(props = {}) {
    const self = this;

    if (!this.server) {
        const { WebSocketServer } = WebSocket;
        const server = new WebSocketServer({
            // noServer: true,
            port: this.port,
            clientTracking: true,
        });
        this.server = server;
        this.connectedClients = 0;

        this.deactivateDefaultConsider = props.deactivateDefaultConsider ?? false

        this.server.on('connection', (ws, request) => {
            const peer = new WSPeer({
                id: `P-${self.peers.size + 1}`,
                socket: ws,
                request: request
            });
            // self.addHandler('connection',peer);
            self.peers.set(peer.id, peer);
            self.logger.listener('onConnection').info(`New client ${peer.id} connected. Total: ${self.peers.size}`);

            if(self.handlers['connection']){
                self.handlers['connection'].forEach((handler) => {
                    handler(peer)
                });
            }
            ws.on('message', (rawData) => {
                self.considerRawMessage(rawData, peer, ws)
            });
            ws.on('close', () => {
                self.considerEvent('close', peer, ws)
                self.logger.info(`Client disconnected. Total: ${self.connectedClients}`);
            });
        });
        this.logger.info(`WSService started on PORT ${this.port}...`);
    }
    ;
}

export default start
