function broadcastRoom(room, message) {
    this.logger.method('broadcastRoom').log(`-> Broadcasting to room ${room}`);
    const peers = this.rooms.get(room);

    if (!peers) {
        return;
    }

    peers.forEach((peer) => {
        peer.send(message);
    });

    this.logger.method('broadcastRoom').trace(`<- Broadcasted to ${peers.size} peers in room ${room}`);
}
export default broadcastRoom;
