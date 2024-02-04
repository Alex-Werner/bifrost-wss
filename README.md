# bifrost-wss

[![NPM Version](https://img.shields.io/npm/v/bifrost-wss.svg?&style=flat-square)](https://www.npmjs.org/package/bifrost-wss)[![Release Date](https://img.shields.io/github/release-date/alex-werner/bifrost-wss)](https://github.com/alex-werner/bifrost-wss/releases/latest)

WebSocket Server & Client library for simple authorized publisher/subscriber communication with rooms/topics.  
Also provides a simple request/response pattern (via command).

Provides full control over handlers and instances, with additional helpers for easy integration with WebSocket Server (WSS).  

## Installation

```bash
npm i bifrost-wss
```

## Usage

### Server side 

```js
import {WSSManager} from 'bifrost-wss'
 const server = new WSSManager( {
    port: 8095,
    host: "localhost",
});
server.createRoom('room-1')
server.createRoom('room-2')

server.addHandler('authorize', function open(peer, accessToken) {
    if(accessToken === process.env.ACCESS_TOKEN) {
        // Deal with Auth for instance, and modify the peer object
        peer.isAuth = true;
    }
})

// Allow a peer to send a command "increment" and get a response
server.addHandler('increment', function increment(peer, message) {
    if(message.requestId){
        peer.send({value: i++, requestId: message.requestId})
    }
});

await server.start()
setInterval(()=>{
    server.logger.level = 'trace';
    server.broadcastRoom('room-1', {type: 'hello', payload: 'room1'})
    server.broadcastRoom('room-2', {type: 'hello', payload: 'room2'})
    server.broadcastAll({type: 'hello', payload: 'all'})
},1000)



```

### Client side


```js
import {WSClient} from 'bifrost-wss'

const client = new WSClient({
    port: 8095,
    host: "localhost",
    headers: {
        access_token: process.env.ACCESS_TOKEN,
    }
});

client.addHandler('open', () => {
    client.authorize();
    setTimeout(() => client.subscribe('room-1'), 10);
    setTimeout(() => client.subscribe('room-2'), 5000);
});

// global handler for all messages, they are in JSON already
client.addHandler('message', (message) => {
    console.log(message);
});

// Will be called only for messages from room-1
client.addHandler('room-1', function message(message) {
    console.log('room-1 handler', message)
});

await client.open();

// Will send a command to the server and wait for a response
const req = client.send({
    cmd: 'increment',
})
const res = await req;
console.log('increment response', res)
```

## Commands 

When .send() is called with a `cmd` property, a requestId will be generated, and a listener associated with the requestId will be created. The response will be awaited and the listener removed.

```js
{
    cmd: 'subscribe',
    room: 'time-beacon'
}
```

## Events

```js
{
    topic: 'time-beacon',
    payload: {time: 1234567890}
}
```

## Features

- **Room/Topic-Based Communication**: Enables communication in specific channels.
- **WebSocket Server and Client**: Provides both server and client components.
- **Reconnection**: Reconnects automatically if the connection drops.
- **Authorization**: Pre-build authorization logic
- **On-the-fly room management**: Allows for the creation and removal of rooms on the fly.
- **Extensible Event Handlers**: Supports adding custom handlers for WebSocket events.
- **Request/Response Pattern**: Supports a simple request/response pattern.


# API Reference

## WSSManager (Server Component)

### `new WSSManager(options)`
- **Description**: Initializes a new WebSocket server.
- **Parameters**:
    - `options`: Object containing configuration options.
        - `port`: (Number) The port number for the server.
        - `host`: (String) The host address for the server.
        - `logger`: (Object) Custom logger object.

### `start()`
- **Description**: Starts the WebSocket server.

### `stop()`
- **Description**: Stops the WebSocket server.

### `createRoom(roomName, force = false)`
- **Description**: Creates a new room.
- **Parameters**:
    - `roomName`: (String) Name of the room to create.
    - `force`: (Boolean) Whether to force the creation of the room if it already exists.

### `removeRoom(roomName)`
- **Description**: Removes an existing room.
- **Parameters**:
    - `roomName`: (String) Name of the room to remove.

### `broadcastRoom(roomName, message, sender = null, broadcastToSelf = false)`
- **Description**: Broadcasts a message to all clients in a specified room.
- **Parameters**:
    - `roomName`: (String) Name of the room.
    - `message`: (Object) Message object to broadcast.
    - `sender`: (Object) Sender peer object. (Optional)
    - `broadcastToSelf`: (Boolean) Whether to broadcast to the sender. (Optional)

### `broadcastAll(message)`
- **Description**: Broadcasts a message to all connected clients.
- **Parameters**:
    - `message`: (Object) Message object to broadcast.

### `addHandler(type, handler)`
- **Description**: Adds a handler for a specific message type.
- **Parameters**:
    - `type`: (String) Type of message.
    - `handler`: (Function) Handler function.

## WSClient (Client Component)

### `new WSClient(options)`
- **Description**: Initializes a new WebSocket client.
- **Parameters**:
    - `options`: Object containing configuration options.
        - `port`: (Number) The port number of the server.
        - `host`: (String) The host address of the server.
        - `headers`: (Object) Headers for WebSocket connection.
        - `isSecure`: (Boolean) When true, use wss - defaults to false.

### `open()`
- **Description**: Opens the WebSocket connection.

### `close()`
- **Description**: Closes the WebSocket connection.

### `subscribe(room)`
- **Description**: Subscribes to a specific room.
- **Parameters**:
    - `room`: (String) Name of the room to subscribe to.

### `authorize(accessToken)`
- **Description**: Authorizes the client using an access token.
- **Parameters**:
    - `accessToken`: (String) Access token for authorization.

### `send(message)`
- **Description**: Sends a message through the WebSocket.
- **Parameters**:
    - `message`: (Object/String) Message object or string to send.

### `addHandler(name, handler)`
- **Description**: Adds a handler for specific client events.
- **Parameters**:
    - `name`: (String) Name of the event.
    - `handler`: (Function) Handler function.
