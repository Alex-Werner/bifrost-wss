import Logger from 'hermodlog';

import addHandler from './methods/addHandler.js';
import addPeerToRoom from './methods/addPeerToRoom.js';
import considerEvent from './methods/considerEvent.js';
import start from './methods/start.js';
import broadcastAll from './methods/broadcastAll.js';
import broadcastRoom from "./methods/broadcastRoom.js";
import createRoom from "./methods/createRoom.js";
import considerCommand from "./methods/considerCommand.js";
import considerRawMessage from "./methods/considerRawMessage.js";

class WSSManager{
    constructor(props = {}) {
        this.logger = props.logger ?? new Logger().context('WSSManager');
        Object.defineProperty(this, 'logger', {
            writable: true,
            enumerable: false,
        });
        this.port = props.port ?? 8090;

        this.handlers = {};

        this.peers = new Map();
        this.rooms = new Map();
    }
}
WSSManager.prototype.addHandler = addHandler;
WSSManager.prototype.addPeerToRoom = addPeerToRoom;
WSSManager.prototype.broadcastAll = broadcastAll;
WSSManager.prototype.broadcastRoom = broadcastRoom;
WSSManager.prototype.considerCommand = considerCommand;
WSSManager.prototype.considerRawMessage = considerRawMessage;
WSSManager.prototype.considerEvent = considerEvent;
WSSManager.prototype.createRoom = createRoom;
WSSManager.prototype.start = start;
export default WSSManager;
