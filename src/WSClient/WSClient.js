import Logger from "hermodlog";
import addHandler from "./methods/addHandler.js";
import authorize from "./methods/authorize.js";
import send from "./methods/send.js";
import open from "./methods/open.js";
import close from "./methods/close.js";
import subscribe from "./methods/subscribe.js";

class WSClient {
    constructor(props = {}) {
        this.host = props.host ?? 'localhost';
        this.port = props.port ?? 8090;

        this.isSecure = false;

        this.id = `${this.host}:${this.port}`;

        this.socket = null;
        this.logger = props.logger ?? new Logger().context(`WSClient(${this.host}:${this.port})`);

        this.handlers = {};

        this.headers = props.headers ?? {};

        this.reconnectAttempts = 0;
    }
}

WSClient.prototype.addHandler = addHandler;
WSClient.prototype.authorize = authorize;
WSClient.prototype.close = close;
WSClient.prototype.open = open;
WSClient.prototype.send = send;
WSClient.prototype.subscribe = subscribe;
export default WSClient;
