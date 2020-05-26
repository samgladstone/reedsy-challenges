import Operation from './Operation';
import { Delete, Insert, Move } from './edits';

describe('Constructor', () => {
    test('Defaults to an empty array', () => {
        expect(new Operation().edits).toEqual([]);
    });

    describe.skip('Uses the editFactory to instantiate the objects', () => {
        let editFactory;
        beforeAll(() => {
            // I'm not sure how to set up this mock
        });
        beforeEach(() => { editFactory.mockClear(); });
        afterAll(() => { editFactory.mockRestore(); });

        test('Calls the editFactory for each passed in edit', () => {
            const e1 = { move: 2 };
            const e2 = { delete: 2 };
            const e3 = { insert: 'hi' };
            new Operation([e1, e2, e3]);

            expect(editFactory).toBeCalledTimes(3);
            expect(editFactory.calls[0][0]).toBe(e1);
            expect(editFactory.calls[0][0]).toBe(e2);
            expect(editFactory).lastCalledWith(e3)
        });

        test('The return of the editFactory is used for the edits', () => {
            const e1 = new Delete(2);
            const e2 = new Insert('Abc');
            const e3 = new Move(2);
            editFactory.mockReturnValueOnce(e1)
                .mockReturnValueOnce(e2)
                .mockReturnValueOnce(e3);

            const op = new Operation([{}, {}, {}]);

            expect(op.edits[0]).toBe(e1);
            expect(op.edits[1]).toBe(e2);
            expect(op.edits[2]).toBe(e3);
        });

        test('If the editFactory returns undefined or null, the value is skipped', () => {
            const e1 = new Delete(2);
            const e2 = new Insert('Abc');
            const e3 = new Move(2);

            editFactory.mockReturnValueOnce(e1)
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce(e2)
                .mockReturnValueOnce(null)
                .mockReturnValueOnce(e3);

            const op = new Operation([{}, {}, {}]);

            expect(op.edits[0]).toBe(e1);
            expect(op.edits[1]).toBe(e2);
            expect(op.edits[2]).toBe(e3);
        });
    })
});

describe('.apply', () => {
    test("The question's op1", () => {
        expect(new Operation([{ move: 1 }, { insert: "FOO" }]).apply('abcdefg')).toBe('aFOObcdefg');
    });

    test("The question's op2", () => {
        expect(new Operation([{ move: 3 }, { insert: "BAR" }]).apply('abcdefg')).toBe('abcBARdefg');
    });
});

describe('Operation.prototype.combine(op: Operation)', () => {
    test.todo('Does not mutate op2');
});

describe('Operation.combine(op1: Operation, op2: Operation)', () => {
    describe('Does not mutate', () => {
        test.todo('op1');
        test.todo('op2');
    });

});

