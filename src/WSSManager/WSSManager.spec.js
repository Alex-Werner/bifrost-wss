import {assert, describe, expect, it} from 'vitest'
import WSSManager from "./WSSManager.js";
import ws from 'ws';

describe('WSSManager', () => {
    it('should init', function () {
        const wssManager = new WSSManager();
        assert.equal(wssManager.logger.history.length, 0)
    });

    it('should work when a client connects to it', function () {

        const wssManager = new WSSManager();
        wssManager.start();
        const client = new ws('ws://localhost:8090');
        client.on('open', function open() {
            console.log('connected')
            client.send('something');
        });
    });

})

