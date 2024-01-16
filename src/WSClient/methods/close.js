export default function close() {
    this.socket?.close();
    this.status = 'closed';
}
