import 'dotenv/config'
import WSClient from "./src/WSClient/WSClient.js";

(async ()=>{
    try{
        const client = new WSClient( {
            port: 8095,
            host: "localhost",
            headers: {
                access_token: process.env.ACCESS_TOKEN,
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

        client.addHandler('message', function message(message) {
            console.log('message handler', message.topic)
        });

        client.addHandler('room-1', function message(message) {
            console.log('room-1 handler', message)
        });

        await client.open()

        setInterval(async ()=>{
            // When sending a cmd, will automatically add a request id to the message
            const req = client.send({
                cmd: 'increment',
            })
            const res = await req;
            console.log('increment response', res)
        }, 5000)

    }catch (e){
        console.log(e)
    }

})()
