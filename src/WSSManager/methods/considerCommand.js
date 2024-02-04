import isJson from "../../utils/isJson.js";

async function considerCommand(peer, message,...args) {
    // Utility function to check if a string is
    //JSON

    const { cmd } = message;
    if(!cmd){
        return;
    }
    this.logger.trace('considerCommand', message);
    switch (cmd) {
        case 'authorize':
            if(message.token){
                this.handlers['authorize']?.forEach(handler => handler(peer, message, ...args));
            }
            break;
        case 'subscribe':
            if(message.room){
                this.addPeerToRoom(peer, message.room);
            }
            break;
        default:
            this.handlers[cmd]?.forEach(handler => handler(peer, message, ...args));
    }
}

export default considerCommand;
