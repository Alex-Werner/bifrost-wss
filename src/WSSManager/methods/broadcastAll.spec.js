import broadcastAll from './broadcastAll.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('broadcastAll', () => {
    let context;

    beforeEach(() => {
        context = {
            peers: new Map(),
            logger: {
                method: vi.fn(() => ({
                    log: vi.fn(),
                    trace: vi.fn(),
                })),
            },
        };
    });

    it('should broadcast message to all peers and log the action', () => {
        const peer1 = { send: vi.fn() };
        const peer2 = { send: vi.fn() };
        context.peers.set('peer1', peer1);
        context.peers.set('peer2', peer2);
        const message = 'test message';

        broadcastAll.call(context, {message});

        expect(peer1.send).toHaveBeenCalledWith({payload: {message}, topic: '*'});
        expect(peer2.send).toHaveBeenCalledWith({payload: {message}, topic: '*'});
        expect(context.logger.method).toHaveBeenCalledWith('broadcastAll');
        // expect(context.logger.method().log).toHaveBeenCalledWith('-> Broadcasting to All');
        // expect(context.logger.method).toHaveBeenCalledWith('broadcastAll');
        // expect(context.logger.method().trace).toHaveBeenCalledWith(`<- Broadcasted to ${context.peers.size} peers`);
    });
});
