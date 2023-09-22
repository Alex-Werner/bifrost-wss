export default function createRoom(roomName) {
    this.rooms.set(roomName, new Map());
}
