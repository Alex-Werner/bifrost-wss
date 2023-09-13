// async function onEvent
//     this.listeners[event]?.forEach((listener) => {
//         listener(...args)
//     });
// }

async function onEvent(event, listener){
    if(!this.listeners[event]){
        this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
}
export default onEvent
