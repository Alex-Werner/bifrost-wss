function broadcastRoom(room, payload, sender = null, broadcastToSelf = false) {
    const logger = this.logger.method('broadcastRoom');
    logger.trace(`-> Broadcasting to room ${room} - `,payload);
    const peers = this.rooms.get(room);
    if (!peers) {
        return;
    }
    peers.forEach((peer) => {
        if (sender && !broadcastToSelf && sender.id === peer.id) {
            return;
        }
        peer.send({ topic: room, payload: payload });
    });
    logger.trace(`<- Broadcasted to ${peers.size} peers in room ${room}`);
}
export default broadcastRoom;
