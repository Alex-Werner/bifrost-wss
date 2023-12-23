function broadcastRoom(room, message, sender = null, broadcastToSelf = false) {
    const logger = this.logger.method('broadcastRoom');
    logger.log(`-> Broadcasting to room ${room} - ${message}`);
    const peers = this.rooms.get(room);
    if (!peers) {
        return;
    }
    peers.forEach((peer) => {
        if (sender && !broadcastToSelf && sender.id === peer.id) {
            return;
        }
        peer.send(message);
    });
    logger.log(`<- Broadcasted to ${peers.size} peers in room ${room}`);
}
export default broadcastRoom;
