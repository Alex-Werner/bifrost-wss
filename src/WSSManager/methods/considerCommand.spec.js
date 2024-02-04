import { describe, it, expect, beforeEach, vi } from 'vitest';
import considerRawMessage from "./considerRawMessage.js";
import considerEvent from "./considerEvent.js";
import considerCommand from "./considerCommand.js";

describe('considerCommand', () => {
    let context;

    beforeEach(() => {
        context = {
            handlers: {
                'message': [],
                'authorize': [],
            },
            considerEvent: vi.fn(),
            considerCommand: vi.fn(),
            addPeerToRoom: vi.fn(),
            logger: {
                trace: vi.fn(),
            }
        };
    });

    it('should handle JSON subscribe message correctly', async () => {
        const peer = { id: 'peer1' };
        const roomName = 'testRoom';
        const message = JSON.stringify({ cmd: 'subscribe', room: roomName });

        await considerRawMessage.call(context, message, peer);
        // console.log(context);
        expect(context.considerCommand).toHaveBeenCalledWith(peer, { cmd: 'subscribe', room: roomName }, undefined);
    });

    it('should handle JSON authorize message correctly', async () => {
        const peer = {};
        const message = { cmd: 'authorize', token: 'accessToken123' };
        const authorizeHandler = vi.fn();
        context.handlers['authorize'].push(authorizeHandler);

        await considerCommand.call(context, peer, message);

        expect(authorizeHandler).toHaveBeenCalledWith(peer, { cmd: 'authorize', token: 'accessToken123' });
    });
});
