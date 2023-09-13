import WSSManager from "./src/WSSManager/WSSManager.js";
import ws from "ws";


(async () => {

    const wssManager = new WSSManager();
    wssManager.start()

    // We set a listener that will allow to setup how we want to act on "message"
    wssManager.onEvent('message', (peer, message) => {
        console.log('This execute on message', message);
        wssManager.logger.listener('onMessage').info(`Received message from ${peer.id} => ${message}`);
        try {
            const parsed = JSON.parse(message.toString())
            console.log('This execute on message:', parsed.type, parsed.payload);
        } catch (err) {
            console.log(message.toString());
            console.error(err);
        }
    })

    // We set a listener that will allow to setup how we want to act on new connection
    wssManager.onEvent('connection', (peer) => {
        wssManager.logger.listener('onConnection').info(`New client ${peer.id} connected. Total: ${wssManager.clients.all.size}`);

        // Peer has request, socket and id
        const {accessKey} = peer.request.headers;
        if(accessKey === '1234567890') {
            // Deal with Auth for instance, and modify the peer object
            peer.isAuth = true;
        }
    });


    const client = new ws('ws://localhost:8090', {
        headers: {
            accessKey: '1234567890',
        }
    });
    client.on('open', function open() {
        console.log('connected')
        client.send('{"type": "hello", "payload": "world"}');
        // client.close()
    });

})()
