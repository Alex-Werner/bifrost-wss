import WSClient from "./src/WSClient/WSClient.js";

(async ()=>{
    try{
        const client = new WSClient( {
            port: 8095,
            host: "localhost",
            headers: {
                access_token: '1234567890',
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

// process.on('unhandledRejection', (error, p) => {
    // console.log('=== UNHANDLED REJECTION ===');
    // console.dir(error.stack);
    // process.exit(1);
//
// });

// process.on('unhandledRejection', (reason, p) => {
    // console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
// });
//
