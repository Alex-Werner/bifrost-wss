import addHandler from './addHandler.js';
import { describe, it, expect } from 'vitest';

describe('addHandler', () => {
    it('adds a new handler for an event', async () => {
        const obj = { handlers: {} };
        const handler = () => {};

        await addHandler.call(obj, 'testEvent', handler);

        expect(obj.handlers['testEvent']).toBeDefined();
        expect(obj.handlers['testEvent']).toContain(handler);
    });

    it('adds multiple handlers for the same event', async () => {
        const obj = { handlers: {} };
        const firstHandler = () => {};
        const secondHandler = () => {};

        await addHandler.call(obj, 'testEvent', firstHandler);
        await addHandler.call(obj, 'testEvent', secondHandler);

        expect(obj.handlers['testEvent']).toHaveLength(2);
        expect(obj.handlers['testEvent']).toEqual(expect.arrayContaining([firstHandler, secondHandler]));
    });
});
