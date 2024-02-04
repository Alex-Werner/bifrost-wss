import 'dotenv/config'
import {WSSManager} from "./src/index.js";

(async ()=>{
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

    let i = 0;
    server.addHandler('increment', function increment(peer, message) {
        if(message.requestId){
            peer.send({value: i++, requestId: message.requestId})
        }
    });

    await server.start()
    setInterval(()=>{
        server.broadcastAll({type: 'message', message: 'all'})
    },3000)

    setInterval(()=>{
        server.broadcastRoom('room-1',{type: 'message', message: 'room-1'})
        server.broadcastRoom('room-2',{type: 'message', message: 'room-2'})
    },7000)

})()
