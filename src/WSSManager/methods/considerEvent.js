async function considerEvent(event,...args) {
    this.listeners[event]?.forEach((listener) => {
        listener(...args)
    });
}

export default considerEvent
