import Logger from 'hermodlog';
import onEvent from './methods/onEvent.js';
import considerEvent from './methods/considerEvent.js';
import start from './methods/start.js';
class WSSManager{
    constructor(props = {}) {
        this.logger = props.logger ?? new Logger().context('WSSManager');
        this.port = props.port ?? 8090;

        this.listeners = {};

        this.clients = {
            all: new Map(),
            subscriptions: new Map(),
        };

        this.isAuth = null;
    }
}
WSSManager.prototype.onEvent = onEvent;
WSSManager.prototype.considerEvent = considerEvent;
WSSManager.prototype.start = start;
export default WSSManager;
