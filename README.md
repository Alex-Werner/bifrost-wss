# bifrost-wss

[![npm version](https://badge.fury.io/js/bifrost-wss.svg)](https://badge.fury.io/js/bifrost-wss)


WebSocket Server & Client library for simple room/topic-based communication between peers and a server.

Simplified helpers for authorization, subscription, and standard `{type, payload}` message handling.

Features automatic reconnection to the server if the connection is lost.

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
server.addHandler('authorize', function open(peer, accessKey) {
    if(accessKey === '1234567890') {
        // Deal with Auth for instance, and modify the peer object
        peer.isAuth = true;
    }
})

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
        access_token: '1234567890',
    }
});

client.addHandler('open', () => {
    client.authorize();
    setTimeout(() => client.subscribe('room-1'), 10);
    setTimeout(() => client.subscribe('room-2'), 5000);
});

client.addHandler('message', (event) => {
    console.log(event.data);
});

await client.open();
```


## Features

- **Room/Topic-Based Communication**: Enables communication in specific channels.
- **WebSocket Server and Client**: Integrates both server (`WSSManager`) and client (`WSClient`) components.
- **Automatic Reconnection**: Reconnects automatically if the connection drops.
- **Simplified Message Handling**: Simplifies handling of `{type, payload}` message structures.
- **Authorization Support**: Adds security through authorization logic.
- **Dynamic Room Management**: Allows for the creation and removal of rooms on the fly.
- **Broadcast Capabilities**: Facilitates message broadcasting to rooms or all clients.
- **Customizable Logging**: Offers adaptable logging for monitoring and debugging.
- **Extensible Event Handlers**: Supports adding custom handlers for WebSocket events.
- **Subscription Management**: Enables clients to subscribe to specific rooms.
- **Reconnection Strategy with Backoff**: Implements a delay in reconnection attempts to reduce server load.
- **Message Sending Methods**: Provides convenient methods for sending messages.
- **Configurable Settings**: Allows custom configuration of server and client settings.
- **Modular Design**: Facilitates the addition of new features and methods.
- **Error Handling and Reporting**: Ensures stable operation with robust error management.

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
