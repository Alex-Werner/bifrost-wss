async function setOnEventListener(event, listener) {
    if(!this.listeners[event]){
        this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
}

export default setOnEventListener
