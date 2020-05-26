import Insert from './Insert';
import { mockOperationTracker } from '../../test';

describe('Insert.prototype.applyTo', () => {
    let freshTracker;
    let movedTracker;
    let workingTracker;
    let behindWorkingTracker;

    beforeAll(() => {
        freshTracker = mockOperationTracker('Hello there....');
        movedTracker = mockOperationTracker('Hello there....', 3);
        workingTracker = mockOperationTracker('Hello there....', 6, 3, ['H', 'i', ' ']);
        behindWorkingTracker = mockOperationTracker('Hello there....', 8, 6, ['H', 'e', 'l', 'l', 'o', ' ', ',']);

        const insert = new Insert('sir');
        insert.applyTo(freshTracker);
        insert.applyTo(movedTracker);
        insert.applyTo(workingTracker);
        insert.applyTo(behindWorkingTracker);
    });

    test('Adds the inserted text to the end of the working text', () => {
        expect(freshTracker.workingText).toEqual(['s', 'i', 'r']);
        expect(movedTracker.workingText).toEqual(['s', 'i', 'r']);
        expect(workingTracker.workingText).toEqual(['H', 'i', ' ', 's', 'i', 'r']);
        expect(behindWorkingTracker.workingText).toEqual(['H', 'e', 'l', 'l', 'o', ' ', 's', 'i', 'r', ',']);
    });

    test('Updates the working text position', () => {
        expect(freshTracker.positionWorkingText).toBe(3);
        expect(movedTracker.positionWorkingText).toBe(3);
        expect(workingTracker.positionWorkingText).toBe(6);
        expect(behindWorkingTracker.positionWorkingText).toBe(9);
    });

    test('Does not updated the starting text position', () => {
        expect(freshTracker.positionStartingText).toBe(0);
        expect(movedTracker.positionStartingText).toBe(3);
        expect(workingTracker.positionStartingText).toBe(6);
        expect(behindWorkingTracker.positionStartingText).toBe(8);
    });
});

describe('Insert.statics.canBeCreatedFrom', () => {
    const isInsert = Insert.canBeCreatedFrom;
    describe('Identifies insert operations', () => {
        test('Insert empty string', () => {
            expect(isInsert({ insert: '' })).toBe(true);
        });

        test('Insert string', () => {
            expect(isInsert({ insert: 'Hello' })).toBe(true);
            expect(isInsert({ insert: 'Or even a little longer' })).toBe(true);
        });
    });

    describe('Other edits return false', () => {
        test('Delete', () => {
            expect(isInsert({ delete: 0 })).toBe(false);
        });

        test('Move', () => {
            expect(isInsert({ move: 4 })).toBe(false);
        });
    });

    describe('Invalid values', () => {
        test('Insert string is required', () => {
            expect(isInsert({})).toBe(false);
            expect(isInsert({ insert: null })).toBe(false);
            expect(isInsert({ insert: undefined })).toBe(false);
        });

        test('Non string values', () => {
            expect(isInsert({ insert: 1 })).toBe(false);
            expect(isInsert({ insert: true })).toBe(false);
            expect(isInsert({ insert: new Date() })).toBe(false);
        });
    });
});