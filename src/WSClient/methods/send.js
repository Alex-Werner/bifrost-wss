export default function send(message) {
    if(typeof message === 'object') {
        message = JSON.stringify(message);
    }
    this.socket.send(message);
}
