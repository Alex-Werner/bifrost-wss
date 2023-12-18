async function considerEvent(event,...args) {
    if(event === 'message'){
        // We want to parse the message and have an helper for
        try {
            const peer = args[0];
            const message = args[1].toString();

            const isJson = (str) => {
                try {
                    return JSON.parse(str);
                } catch (e) {
                    return false;
                }
            }
            const parsed = isJson(message);

            if(!parsed){
                throw new Error('Not a JSON');
            }
            if(parsed.type === 'authorize'){
                const accessToken = parsed.payload;
                this.handlers['authorize']?.forEach((handler) => {
                    handler(peer, accessToken)
                });
            }
            if(parsed.type === 'subscribe'){
                this.addPeerToRoom(peer, parsed.payload)
            }
            this.handlers['message']?.forEach((handler) => {
                try { 
                    handler(peer, parsed)
                } catch(err){
                    console.error('Error in message handler');
                    console.error(err)
                }
            })
        } catch (err) {
            console.log(args[1].toString());
            console.error(err);
            this.handlers['message']?.forEach((handler) => {
                handler(...args)
            })
        }
    } else {
        this.handlers[event]?.forEach((handler) => {
            handler(...args)
        });
    }
}

export default considerEvent
