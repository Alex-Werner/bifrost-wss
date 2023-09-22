export default function addPeerToRoom(peer, roomName) {
    if(!this.rooms.has(roomName)) {
        return new Error(`Room ${roomName} does not exist`)
    }
    this.rooms.get(roomName).set(peer.id, peer);
    this.logger.method('addPeerToRoom').info(`Peer ${peer.id} added to room ${roomName}`)
}
