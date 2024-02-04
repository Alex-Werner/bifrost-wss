async function considerEvent(eventName, ...args) {
    const [peer, message, ...leftArgs] = args;

    const isCommand = !!message.cmd;
    this.logger.trace(`considerEvent ${eventName} ${isCommand ? '- is command' : ''}`);

    switch (eventName) {
        case 'message':
            // Process generic message handlers
            this.handlers['message']?.forEach(handler => {
                try {
                    handler(peer, message, ...leftArgs);
                } catch (err) {
                    this.logger.error('Error in message handler', err);
                }
            });
            break;
        case 'close':
            // Process generic close handlers
            this.handlers['close']?.forEach(handler => {
                try {
                    handler(peer, message, ...leftArgs);
                } catch (err) {
                    this.logger.error('Error in close handler', err);
                }
            });
            break;
        default:
            if(isCommand){
                return;
            }
            // Process other events generically
            this.handlers[eventName]?.forEach(handler => {
                try {
                    handler(peer, message, ...leftArgs);
                } catch (err) {
                    this.logger.error(`Error in ${eventName} handler`, err);
                }
            });
    }
}

export default considerEvent;
