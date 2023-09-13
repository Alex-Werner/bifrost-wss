# bifrost-wss

Simple websocket server for bifrost that helps you with the repetitive tasks of creating a websocket server, hooks and dealing with clients.


## Installation

```bash
npm i bifrost-wss
```

## Usage

```js
import WSSManager from "./src/WSSManager/WSSManager.js";
import ws from "ws";

const wssManager = new WSSManager();
wssManager.start()

// We set a listener that will allow to setup how we want to act on "message"
wssManager.setOnEventListener('message', (peer, message) => {
    wssManager.logger
        .listener('onMessage')
        .info(`Received message from ${peer.id} => ${message}`);
    try {
        const parsed = JSON.parse(message.toString())
        console.log('This execute on message', parsed.type, parsed.payload);
    } catch (err) {
        console.log(message.toString());
        console.error(err);
    }
})


// We set a listener that will allow to setup how we want to act on new connection
wssManager.setOnEventListener('connection', (peer) => {
    wssManager.logger
        .listener('onConnection')
        .info(`New client ${peer.id} connected. Total: ${wssManager.clients.all.size}`);

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
    client.close()
});
```

## API

### WSSManager

#### `new WSSManager(options)`

Create a new WSSManager instance.

##### `start()`

Start the websocket server.

##### `stop()`

Stop the websocket server.

##### `setOnEventListener(event, callback)`

Set a listener for the given event.

Some events: `connection`, `message`, `close`, `error`.

##### `logger`

The logger instance.

##### `clients`

The clients WSPeer instances

### WSPeer

#### `new WSPeer(options)`

Create a new WSPeer instance.

##### `id`

The id of the peer.

##### `request`

The request object of the peer.

##### `socket`

The socket object of the peer.

##### `isAuth`

The auth status of the peer (if set).
