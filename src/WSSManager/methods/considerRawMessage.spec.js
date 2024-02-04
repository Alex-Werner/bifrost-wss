import { describe, it, expect, beforeEach, vi } from 'vitest';
import considerRawMessage from './considerRawMessage.js';
import considerCommand from './considerCommand.js';
import considerEvent from './considerEvent.js';

describe('considerRawMessage', () => {
    let context;
    let rawData;
    let peer;
    let ws;

    beforeEach(() => {
        context = {
            considerCommand: vi.fn(),
            considerEvent: vi.fn(),
        };
        rawData = JSON.stringify({ cmd: 'testCommand' });
        peer = { id: 'peer1' };
        ws = {};
    });

    it('should parse raw message and call considerCommand and considerEvent', () => {
        considerRawMessage.call(context, rawData, peer, ws);

        expect(context.considerCommand).toHaveBeenCalledWith( peer, { cmd: 'testCommand' }, ws);
        expect(context.considerEvent).toHaveBeenCalledWith('message', peer, { cmd: 'testCommand' }, ws);
    });
});
