export default function addHandler(name, handler) {
    if (!this.handlers[name]) {
        this.handlers[name] = [];
    }
    this.handlers[name].push(handler);
}
