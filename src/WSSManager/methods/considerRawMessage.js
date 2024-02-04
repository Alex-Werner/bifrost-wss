import parseRawMessage from "../../utils/parseRawMessage.js";

export default function considerRawMessage(rawData, peer, ws){
    const message = parseRawMessage(rawData);
    if(message.cmd){
        this.considerCommand(peer, message, ws);
    }
    this.considerEvent('message', peer, message, ws)
}
