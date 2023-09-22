import {WSSManager} from "./src/index.js";

(async ()=>{
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
})()
