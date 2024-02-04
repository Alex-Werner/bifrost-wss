function broadcastAll(payload) {
    const logger = this.logger.method('broadcastAll')
    logger.trace(`-> Broadcasting to All`);

    this.peers.forEach((peer) => {
            peer.send({topic: '*', payload});
        });
    logger.trace(`<- Broadcasted to ${this.peers.size} peers`);
}
export default broadcastAll;
