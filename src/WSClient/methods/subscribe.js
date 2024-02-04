export default function subscribe(room) {
    this.logger.method('subscribe()').info(`Subscribing to ${room}`)
    this.send({
        cmd: 'subscribe',
        room: room
    })
}
