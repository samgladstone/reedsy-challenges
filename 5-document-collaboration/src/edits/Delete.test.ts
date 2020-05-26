import Delete from './Delete';
import { mockOperationTracker } from '../../test';

describe('Delete.prototype.applyTo', () => {
    test('Moves up the position in the starting version by the .delete val', () => {
        const tracker1 = mockOperationTracker('This is our dummy text');
        new Delete(4).applyTo(tracker1);
        expect(tracker1.positionStartingText).toBe(4);

        const tracker2 = mockOperationTracker('This is our dummy text', 5, 5);
        new Delete(6).applyTo(tracker2);
        expect(tracker2.positionStartingText).toBe(11);
    });

    test('Does not change the position in the working text', () => {
        const tracker1 = mockOperationTracker('This is our dummy text');
        new Delete(4).applyTo(tracker1);
        expect(tracker1.positionWorkingText).toBe(0);

        const tracker2 = mockOperationTracker('This is our dummy text', 5, 5);
        new Delete(6).applyTo(tracker2);
        expect(tracker2.positionWorkingText).toBe(5);
    });

    describe('If we are positioned in our working text (rather than in the starting text)', () => {
        test('Working text characters are deleted', () => {
            const tracker = mockOperationTracker('This is our dummy text', 3, 3, ['T', 'h', 'i', 's', ' ', 'i', 's', ' ', 'o']);
            new Delete(4).applyTo(tracker);
            expect(tracker.positionStartingText).toBe(3);
            expect(tracker.positionWorkingText).toBe(3);
            expect(tracker.workingText).toEqual(['T', 'h', 'i', ' ', 'o']);
        });

        test('If we need to delete more characters than we have in our working text, the remainder is deleted from the starting text', () => {
            const tracker = mockOperationTracker('This is our dummy text', 3, 3, ['T', 'h', 'i', 's', 'o']);
            new Delete(5).applyTo(tracker);
            expect(tracker.positionStartingText).toBe(6);
            expect(tracker.positionWorkingText).toBe(3);
            expect(tracker.workingText).toEqual(['T', 'h', 'i']);
        });
    });

    test('Throws an error if deleting characters beyond the end of the string', () => {
        const tracker = mockOperationTracker('This is our dummy text', 22);
        expect(() => new Delete(4).applyTo(tracker)).toThrow('Cannot delete characters beyond the end of the string');
    });
});

describe('Delete.statics.canBeCreatedFrom', () => {
    const isDelete = Delete.canBeCreatedFrom;

    describe('Identifies delete edit', () => {
        test('Delete 0 characters', () => {
            expect(isDelete({ delete: 0 })).toBe(true);
        });

        test('Delete x characters', () => {
            expect(isDelete({ delete: 4 })).toBe(true);
            expect(isDelete({ delete: 100 })).toBe(true);
        });
    });

    describe('Other edits return false', () => {
        test('Insert', () => {
            expect(isDelete({ insert: 'test' })).toBe(false);
        });

        test('Move', () => {
            expect(isDelete({ move: 4 })).toBe(false);
        });
    });

    describe('Invalid values', () => {
        test('Delete count is negative', () => {
            expect(isDelete({ delete: -1 })).toBe(false);
            expect(isDelete({ delete: -100 })).toBe(false);
        });

        test('Delete count is not an interger', () => {
            expect(isDelete({ delete: 1.1 })).toBe(false);
            expect(isDelete({ delete: 3000.56 })).toBe(false);
            expect(isDelete({ delete: -222.56 })).toBe(false);
        });

        test('Delete count value is required', () => {
            expect(isDelete({})).toBe(false);
            expect(isDelete({ delete: null })).toBe(false);
            expect(isDelete({ delete: undefined })).toBe(false);
        });

        test('Non number values', () => {
            expect(isDelete({ delete: '1' })).toBe(false);
            expect(isDelete({ delete: 'Hello there' })).toBe(false);
            expect(isDelete({ delete: true })).toBe(false);
            expect(isDelete({ delete: new Date() })).toBe(false);
        });
    });
})