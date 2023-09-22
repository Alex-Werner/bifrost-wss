// async function onEvent
//     this.listeners[event]?.forEach((listener) => {
//         listener(...args)
//     });
// }

async function addHandler(event, handler){
    if(!this.handlers[event]){
        this.handlers[event] = [];
    }
    this.handlers[event].push(handler);
}
export default addHandler
