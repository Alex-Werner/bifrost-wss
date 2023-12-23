import createRoom from './createRoom.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('createRoom', () => {
    let context;

    let createRoomLogger;

    beforeEach(() => {
        context = {
            rooms: new Map(),
            logger: {
                method: vi.fn(() => ({
                    log: vi.fn(),
                    error: vi.fn(),
                })),
            },
        };

        createRoomLogger = {
            log: vi.fn(),
            error: vi.fn(),
        };

        context.logger.method = vi.fn((methodName) => {
            if (methodName === 'createRoom') {
                return createRoomLogger;
            }
            return {
                log: vi.fn(),
                error: vi.fn(),
            };
        });

        // Reset logger methods for each test
        createRoomLogger.log.mockClear();
        createRoomLogger.error.mockClear();
    });

    it('should create a new room', () => {
        const roomName = 'newRoom';

        createRoom.call(context, roomName);

        expect(context.rooms.has(roomName)).toBe(true);
        expect(context.logger.method).toHaveBeenCalledWith('createRoom');
        expect(createRoomLogger.log).toHaveBeenCalledWith(`Room ${roomName} created`);
    });

    it('should not create a room if it already exists and force is false', () => {
        const roomName = 'existingRoom';
        context.rooms.set(roomName, new Map());

        createRoom.call(context, roomName);

        expect(context.rooms.get(roomName)).toBeDefined();
        expect(createRoomLogger.error).not.toHaveBeenCalled();
    });

    it('should return an error if the room already exists and force is true', () => {
        const roomName = 'existingRoom';

        context.rooms.set(roomName, new Map());

        const result = createRoom.call(context, roomName, true);

        expect(result).toBeInstanceOf(Error);
        expect(context.logger.method).toHaveBeenCalledWith('createRoom');
        expect(createRoomLogger.error).toHaveBeenCalledWith(`Room ${roomName} already exists`);
    });

    // Additional tests can be added here
});
