import Move from './Move';
import { mockOperationTracker } from '../../test';

describe('Move.prototype.applyTo', () => {
    const mockText = 'Why hello there!';

    describe('Positive move value: If we are positioned at the end of our working text (aka in the starting text)', () => {
        let freshTracker;
        let movedTracker;
        let workingTracker;

        beforeAll(() => {
            freshTracker = mockOperationTracker(mockText);
            movedTracker = mockOperationTracker(mockText, 5);
            workingTracker = mockOperationTracker(mockText, 6, 4, ['W', 'h', 'y', ' ']);

            const move = new Move(4);
            move.applyTo(freshTracker);
            move.applyTo(movedTracker);
            move.applyTo(workingTracker);
        });

        test('Throws an error if we move beyond the end of the text', () => {
            const err = 'Cannot move beyond the end of the string';

            expect(() => new Move(mockText.length).applyTo(mockOperationTracker(mockText))).not.toThrow(err);
            expect(() => new Move(mockText.length + 1).applyTo(mockOperationTracker(mockText))).toThrow(err);
            expect(() => new Move(100).applyTo(mockOperationTracker(mockText))).toThrow(err);
        });

        test('Moves the position in the starting text up by the move value', () => {
            expect(freshTracker.positionStartingText).toBe(4);
            expect(movedTracker.positionStartingText).toBe(9);
            expect(workingTracker.positionStartingText).toBe(10);
        });

        test('Moves the position in the working text up by the move value', () => {
            expect(freshTracker.positionWorkingText).toBe(4);
            expect(movedTracker.positionWorkingText).toBe(4);
            expect(workingTracker.positionWorkingText).toBe(8);
        });

        test('Adds the characters that were moved over to the working text', () => {
            expect(freshTracker.workingText).toEqual(['W', 'h', 'y', ' ']);
            expect(movedTracker.workingText).toEqual(['e', 'l', 'l', 'o']);
            expect(workingTracker.workingText).toEqual(['W', 'h', 'y', ' ', 'l', 'l', 'o', ' ']);
        });
    });

    describe('Positive move value: If we are positioned within our working text (rather than in the starting text)', () => {
        let behindTracker;
        let mockWorkingText;

        beforeAll(() => {
            mockWorkingText = ['W', 'h', 'y', ' ', 'H', 'e', 'l', 'l'];
            behindTracker = mockOperationTracker(mockText, 5, 2, mockWorkingText);
            new Move(4).applyTo(behindTracker);
        });

        test('Moves the position in the working text up by the move value', () => {
            expect(behindTracker.positionWorkingText).toBe(6);
        });

        test('Does not move the position in the starting text', () => {
            expect(behindTracker.positionStartingText).toBe(5);
        });

        test('Does not change the working text', () => {
            expect(behindTracker.workingText).toEqual(mockWorkingText);
        });

        describe('If we move past the end of the working text and into the starting text', () => {
            let behindTracker;

            beforeAll(() => {
                behindTracker = mockOperationTracker(mockText, 5, 2, mockWorkingText);
                // This moves 2 past the end due to position 2
                new Move(8).applyTo(behindTracker);
            });

            test('Throws an error if we move beyond the end of the starting text', () => {
                const err = 'Cannot move beyond the end of the string';

                expect(() =>
                    new Move(mockText.length - 5 + mockWorkingText.length - 2)
                        .applyTo(mockOperationTracker(mockText, 5, 2, mockWorkingText))
                ).not.toThrow(err);

                expect(() =>
                    new Move(mockText.length - 5 + 1 + mockWorkingText.length - 2)
                        .applyTo(mockOperationTracker(mockText, 5, 2, mockWorkingText))
                ).toThrow(err);

                expect(() =>
                    new Move(100)
                        .applyTo(mockOperationTracker(mockText, 5, 2, mockWorkingText))
                ).toThrow(err);
            });

            test('Moves the position in the working text up by the move value', () => {
                expect(behindTracker.positionWorkingText).toBe(10);
            });

            test('Moves the position in the starting text up by the leftover move value', () => {
                // Leftover move value is 2
                expect(behindTracker.positionStartingText).toBe(7);
            });

            test('Adds the characters that were moved over (in the starting text only) to the working text', () => {
                expect(behindTracker.workingText).toEqual([
                    ...mockWorkingText, 'e', 'l'
                ]);
            });
        });

    });

    describe('Negative move value', () => {
        let negativeTracker, mockWorkingText;

        beforeAll(() => {
            mockWorkingText = ['W', 'h', 'y', ' ', 'Y'];
            negativeTracker = mockOperationTracker(mockText, 6, 5, mockWorkingText);
            new Move(-4).applyTo(negativeTracker);
        });

        test('Throws error if we move beyond the start of the working text', () => {
            const err = 'Cannot move beyond the start of the string';

            expect(() => new Move(-5).applyTo(mockOperationTracker(mockText, 6, 5, mockWorkingText))).not.toThrow(err);
            expect(() => new Move(-6).applyTo(mockOperationTracker(mockText, 6, 5, mockWorkingText))).toThrow(err);
            expect(() => new Move(-100).applyTo(mockOperationTracker(mockText, 6, 5, mockWorkingText))).toThrow(err);
        });

        test('Moves the position in the working text up by the move value', () => {
            expect(negativeTracker.positionWorkingText).toBe(1);
        });

        test('Does not move the position in the starting text', () => {
            expect(negativeTracker.positionStartingText).toBe(6);
        });

        test('Does not change the working text', () => {
            expect(negativeTracker.workingText).toEqual(mockWorkingText);
        });
    });
});

describe('Move.statics.canBeCreatedFrom', () => {
    const isMove = Move.canBeCreatedFrom;

    describe('Identifies move edit', () => {
        test('Move 0 characters', () => {
            expect(isMove({ move: 0 })).toBe(true);
        });

        test('Move x characters', () => {
            expect(isMove({ move: 4 })).toBe(true);
            expect(isMove({ move: 100 })).toBe(true);
        });

        test('Move x backwards', () => {
            expect(isMove({ move: -1 })).toBe(true);
            expect(isMove({ move: -100 })).toBe(true);
        });
    });

    describe('Other edits return false', () => {
        test('Delete', () => {
            expect(isMove({ delete: 4 })).toBe(false);
        });

        test('Insert', () => {
            expect(isMove({ insert: 'test' })).toBe(false);
        });
    });

    describe('Invalid values', () => {
        test('Move count is not an interger', () => {
            expect(isMove({ move: 1.1 })).toBe(false);
            expect(isMove({ move: 3000.56 })).toBe(false);
            expect(isMove({ move: -222.56 })).toBe(false);
        });

        test('Move count value is required', () => {
            expect(isMove({})).toBe(false);
            expect(isMove({ move: null })).toBe(false);
            expect(isMove({ move: undefined })).toBe(false);
        });

        test('Non number values', () => {
            expect(isMove({ move: '1' })).toBe(false);
            expect(isMove({ move: 'Hello there' })).toBe(false);
            expect(isMove({ move: true })).toBe(false);
            expect(isMove({ move: new Date() })).toBe(false);
        });
    });
});