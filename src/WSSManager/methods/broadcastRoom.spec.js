import broadcastRoom from './broadcastRoom.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('broadcastRoom', () => {
    let context;

    beforeEach(() => {
        context = {
            rooms: new Map(),
            logger: {
                method: vi.fn(() => ({
                    log: vi.fn(),
                })),
            },
        };
    });

    it('should broadcast message to all peers in a room', () => {
        const roomName = 'testRoom';
        const message = 'hello';
        const peer1 = {id: '1', send: vi.fn()};
        const peer2 = {id: '2', send: vi.fn()};
        context.rooms.set(roomName, new Map([['1', peer1], ['2', peer2]]));

        broadcastRoom.call(context, roomName, message);

        expect(peer1.send).toHaveBeenCalledWith(message);
        expect(peer2.send).toHaveBeenCalledWith(message);
        expect(context.logger.method).toHaveBeenCalledWith('broadcastRoom');
        // expect(context.logger.method().log).toHaveBeenCalledWith(`-> Broadcasting to room ${roomName} - ${message}`);
        // expect(context.logger.method().log).toHaveBeenCalledWith(`<- Broadcasted to 2 peers in room ${roomName}`);
    });

    it('should not broadcast to the sender if broadcastToSelf is false', () => {
        const roomName = 'testRoom';
        const message = 'hello';
        const sender = {id: '1', send: vi.fn()};
        const peer2 = {id: '2', send: vi.fn()};
        context.rooms.set(roomName, new Map([['1', sender], ['2', peer2]]));

        broadcastRoom.call(context, roomName, message, sender, false);

        expect(sender.send).not.toHaveBeenCalled();
        expect(peer2.send).toHaveBeenCalledWith(message);
    });

    it('should do nothing if the room does not exist', () => {
        const roomName = 'nonExistentRoom';
        const message = 'hello';

        broadcastRoom.call(context, roomName, message);

        expect(context.logger.method().log).not.toHaveBeenCalledWith(`-> Broadcasting to room ${roomName} - ${message}`);
        expect(context.logger.method().log).not.toHaveBeenCalledWith(`<- Broadcasted to ${context.rooms.size} peers in room ${roomName}`);
    });
});
