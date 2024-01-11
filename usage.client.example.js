import WSClient from "./src/WSClient/WSClient.js";

const access_token = '';
(async ()=>{
    try{
        const client = new WSClient( {
            port: 8095,
            host: "localhost",
            headers: {
                access_token,
            }
        });
        client.addHandler('open', function open() {
            console.log('connected now')

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
    }catch (e){
        console.log(e)
    }

})()
