import {WebSocketServer} from 'ws';
import WSPeer from "../../WSPeer/WSPeer.js";
async function start() {
    const self = this;

    if (!this.server) {
        const server = new WebSocketServer({
            // noServer: true,
            port: this.port,
            clientTracking: true,
        });
        this.server = server;
        this.connectedClients = 0;

        this.server.on('connection', (ws, request) => {
            const peer = new WSPeer({
                id: `P-${self.clients.all.size + 1}`,
                socket: ws,
                request: request
            });
            self.onEvent('connection',peer);
            self.clients.all.set(peer.peerID, peer);
            self.logger.listener('onConnection').info(`New client ${peer.peerID} connected. Total: ${self.clients.all.size}`);

            ws.on('message', (message) => {
                self.onEvent('message', peer, message)
            });
            ws.on('close', () => {
                self.onEvent('close', ws)
                self.logger.info(`Client disconnected. Total: ${self.connectedClients}`);
            });
            ws.send('Welcome new client!');
        });
        this.logger.info('WSService started on PORT 8090... ');
    }
    ;
}

export default start
