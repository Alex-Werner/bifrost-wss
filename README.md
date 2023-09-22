# bifrost-wss


WebSocket Server + Client for simple room/topic based communication between peers and a server.    

Simplified helpers for authorize, subscribe and standard {type,payload} message.     

Automatically reconnects to the server if the connection is lost.   

You keep full control on handlers or instances themselves, just some additional helpers for a plug&play with WSS.   


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
import {WSConnection} from 'bifrost-wss'

const client = new WSClient( {
    port: 8095,
    host: "localhost",
    headers: {
        access_token: '1234567890',
    }
});
client.addHandler('open', function open() {
    client.authorize();

    setTimeout(()=>{
        client.subscribe('room-1');
    },10)

    setTimeout(()=>{
        client.subscribe('room-2');
    }, 5000)
});

client.addHandler('message', function message(event) {
    console.log(event.data)
});
await client.open()
```
## API

### WSSManager

#### `new WSSManager(options)`
Create a new WSSManager instance.

##### `options`
Type: `object`

###### `options.port`
Type: `number`<br>
Default: `8095`

Port to listen on.

###### `options.host`
Type: `string`<br>
Default: `localhost`

Host to listen on.

###### `options.logger`
Type: `object`<br>
Default: `console`

Logger object to use. Must have `info`, `error`, `debug` and `trace` methods.


#### `wssManager.start()`
Start the server.

#### `wssManager.stop()`
Stop the server.

#### `wssManager.createRoom(roomName)`
Create a new room.

##### `roomName`
Type: `string`

Name of the room to create.

#### `wssManager.removeRoom(roomName)`
Remove a room.

##### `roomName`
Type: `string`

Name of the room to remove.

#### `wssManager.broadcastRoom(roomName, message)`
Broadcast a message to all clients in a room.

##### `roomName`
Type: `string`

Name of the room to broadcast to.

##### `message`
Type: `object`

Message to broadcast.

#### `wssManager.broadcastAll(message)`
Broadcast a message to all clients.

##### `message`
Type: `object`

Message to broadcast.
    
#### `wssManager.addHandler(type, handler)`
Add a handler for a specific message type.

##### `type`
Type: `string`

Type of message to handle.

##### `handler`
Type: `function`

Handler function to call when a message of the specified type is received.

#### `wssManager.removeHandler(type, handler)`
Remove a handler for a specific message type.

##### `type`
Type: `string`

Type of message to remove handler for.

##### `handler`
Type: `function`

Handler function to remove.

#### `wssManager.addPeerHandler(type, handler)`
Add a handler for a specific peer message type.

##### `type`
Type: `string`

Type of message to handle.

##### `handler`
Type: `function`

Handler function to call when a message of the specified type is received.

#### `wssManager.removePeerHandler(type, handler)`
Remove a handler for a specific peer message type.

##### `type`
Type: `string`

Type of message to remove handler for.

##### `handler`
Type: `function`

Handler function to remove.

#### `wssManager.addRoomHandler(type, handler)`
Add a handler for a specific room message type.

##### `type`
Type: `string`

Type of message to handle.

##### `handler`
Type: `function`

Handler function to call when a message of the specified type is received.

#### `wssManager.removeRoomHandler(type, handler)`
Remove a handler for a specific room message type.

##### `type`
Type: `string`

Type of message to remove handler for.

##### `handler`
Type: `function`

Handler function to remove.
