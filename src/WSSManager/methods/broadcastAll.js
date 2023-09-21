function broadcastAll(message) {
    this.clients.all.forEach((client) => {
        client.ws.send(message);
    });
}
export default broadcastAll;
