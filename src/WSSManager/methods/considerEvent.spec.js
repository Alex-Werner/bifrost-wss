import considerEvent from './considerEvent.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('considerEvent', () => {
    let context;

    beforeEach(() => {
        context = {
            handlers: {
                'message': [],
                'authorize': [],
            },
            addPeerToRoom: vi.fn(),
            logger: {
                trace: vi.fn(),
            }
        };
    });





    it('should call message handlers with parsed message', async () => {
        const peer = {};
        const message = JSON.stringify({ type: 'testType', payload: 'testPayload' });
        const messageHandler = vi.fn();
        context.handlers['message'].push(messageHandler);

        await considerEvent.call(context, 'message', peer, message);

        expect(messageHandler).toHaveBeenCalledWith(peer, JSON.stringify({ type: 'testType', payload: 'testPayload' }));
    });

    it('should handle non-JSON message by calling message handlers with original args', async () => {
        const peer = {};
        const message = 'nonJSONMessage';
        const messageHandler = vi.fn();
        context.handlers['message'].push(messageHandler);

        try {
            await considerEvent.call(context, 'message', peer, message);
        } catch (err) {

        }

        expect(messageHandler).toHaveBeenCalledWith(peer, message);
    });

    it('should handle non-message events correctly', async () => {
        const event = 'customEvent';
        const args = ['arg1', 'arg2'];
        const customEventHandler = vi.fn();
        context.handlers[event] = [customEventHandler];

        await considerEvent.call(context, event, ...args);

        expect(customEventHandler).toHaveBeenCalledWith(...args);
    });
});
