function broadcastAll(message) {
    this.logger.method('broadcastRoom').log(`-> Broadcasting to All`);

    this.peers.forEach((peer) => {
            peer.send(message);
        });
        this.logger.method('broadcastAll').trace(`<- Broadcasted to ${this.peers.size} peers`);
}
export default broadcastAll;
