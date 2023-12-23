export default function createRoom(roomName, force = false) {
    if(this.rooms.has(roomName) && force) {
        this.logger.method('createRoom').error(`Room ${roomName} already exists`)
        return new Error(`Room ${roomName} already exists`)
    }
    this.rooms.set(roomName, new Map());
    this.logger.method('createRoom').log(`Room ${roomName} created`)
}
