class WSPeer {
    constructor(props = {}) {
        this.id = props.id;
        if(!this.id){
            throw new Error('WSPeer requires a peerId');
        }
        this.socket = props.socket;
        if(!this.socket){
            throw new Error('WSPeer requires a socket');
        }

        this.request = props.request ?? {};

        this.isAuth = null;
    }
}
export default WSPeer;
