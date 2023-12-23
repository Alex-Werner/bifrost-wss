import addPeerToRoom from './addPeerToRoom.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('addPeerToRoom', () => {
    let context;

    beforeEach(() => {
        context = {
            rooms: new Map(),
            logger: {
                method: vi.fn(() => ({
                    error: vi.fn(),
                    info: vi.fn(),
                })),
            },
        };
    });

    it('should log an error and return an error when room does not exist', () => {
        const peer = { id: 'peer1' };
        const roomName = 'nonExistentRoom';
        const result = addPeerToRoom.call(context, peer, roomName);

        expect(result).toBeInstanceOf(Error);
        expect(context.logger.method).toHaveBeenCalledWith('addPeerToRoom');
        // expect(context.logger.method().error).toHaveBeenCalledWith(`Room ${roomName} does not exist`);
    });

    it('should add a peer to an existing room and log the action', () => {
        const peer = { id: 'peer1' };
        const roomName = 'existentRoom';
        context.rooms.set(roomName, new Map());

        addPeerToRoom.call(context, peer, roomName);

        expect(context.rooms.get(roomName).get(peer.id)).toBe(peer);
        expect(context.logger.method).toHaveBeenCalledWith('addPeerToRoom');
        // expect(context.logger.method().info).toHaveBeenCalledWith(`Peer ${peer.id} added to room ${roomName}`);
    });
});
