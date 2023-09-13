// async function onEvent
//     this.listeners[event]?.forEach((listener) => {
//         listener(...args)
//     });
// }

async function onEvent(event,...args){
    this.listeners[event]?.forEach((listener) => {
        listener(...args)
    });
}
export default onEvent
