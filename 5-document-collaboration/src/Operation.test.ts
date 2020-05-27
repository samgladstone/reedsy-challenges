import Operation, { ensureAllAreEdits } from './Operation';
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


    test("More complicated example", () => {
        expect(new Operation([
            { move: 3 },
            { insert: "BAR" },
            { move: 1 },
            { delete: 2 },
            { move: -3 },
            { delete: 1 },
            { insert: 'a' },
        ]).apply('Why hello there!')).toBe('WhyBaR llo there!');
    });
});

describe('Operation.prototype.combine(op: Operation)', () => {
    test('Returns the modified operation', () => {
        const op1 = new Operation([{ move: 3 }, { insert: 'A' }]);
        const op2 = new Operation([{ delete: 1 }]);

        expect(op1.combine(op2)).toBe(op1);
    });

    test('Does not mutate op2', () => {
        const op1 = new Operation([{ move: 3 }, { insert: 'A' }]);
        const op2 = new Operation([{ delete: 1 }]);
        op1.combine(op2);
        expect(op2.edits).toEqual(ensureAllAreEdits([{ delete: 1 }]));
    });

    generalCombineTests((op1, op2) => op1.combine(op2));
});

describe('Operation.combine(op1: Operation, op2: Operation)', () => {
    describe('Does not mutate either of the passed in operations', () => {
        test('op1', () => {
            const op1 = new Operation([{ move: 3 }, { insert: 'A' }]);
            const op2 = new Operation([{ delete: 1 }]);
            Operation.combine(op1, op2);
            expect(op1.edits).toEqual(ensureAllAreEdits([{ move: 3 }, { insert: 'A' }]));

        });
        test('op2', () => {
            const op1 = new Operation([{ move: 3 }, { insert: 'A' }]);
            const op2 = new Operation([{ delete: 1 }]);
            Operation.combine(op1, op2);
            expect(op2.edits).toEqual(ensureAllAreEdits([{ delete: 1 }]));

        });
    });

    generalCombineTests((op1, op2) => Operation.combine(op1, op2));
});

/** Both Operation.statics.combine and Operation.prototype.combine should result in the same thing, so test them the same way  */
function generalCombineTests(doOperation: (op1: Operation, op2: Operation) => Operation) {
    test('The questions example', () => {
        const s = 'abcdefg';
        const op1 = new Operation([{ move: 1 }, { insert: "FOO" }]);
        const op2 = new Operation([{ move: 3 }, { insert: "BAR" }]);

        expect(op1.apply(s)).toBe('aFOObcdefg');
        expect(op2.apply(s)).toBe('abcBARdefg');


        const combined1 = Operation.combine(op1, op2);
        expect(combined1.apply(s)).toBe('aFOObcBARdefg');

        const combined2 = Operation.combine(op2, op1);

        expect(combined2.apply(s)).toBe(combined1.apply(s));
    });

    test('One set of operations can be longer than the other', () => {
        const edits = [{ move: 2 }, { insert: 'abc' }]
        expect(doOperation(new Operation(edits), new Operation([])).edits)
            .toEqual(ensureAllAreEdits([{ move: 2 }, { insert: 'abc' }]));
    });

    describe('Reordering and collating edits together', () => {
        test('Two moves are combined', () => {
            const edits = [{ move: 2 }, { move: 4 }]
            expect(doOperation(new Operation(edits), new Operation([])).edits)
                .toEqual(ensureAllAreEdits([{ move: 6 }]));
        });

        test('Two deletes are combined', () => {
            const edits = [{ delete: 2 }, { delete: 3 }]
            expect(doOperation(new Operation(edits), new Operation([])).edits)
                .toEqual(ensureAllAreEdits([{ delete: 5 }]));
        });

        test('Deletes are done before inserts', () => {
            const edits = [{ insert: 'abc' }, { delete: 3 }]
            expect(doOperation(new Operation(edits), new Operation([])).edits)
                .toEqual(ensureAllAreEdits([{ delete: 3 }, { insert: 'abc' }]));
        });

        test('Inserts are combined with inserts', () => {
            const edits = [{ insert: 'abc' }, { insert: 'def' }]
            expect(doOperation(new Operation(edits), new Operation([])).edits)
                .toEqual(ensureAllAreEdits([{ insert: 'abcdef' }]));
        });

        test('Combining multiple deletes and inserts', () => {
            const edits = [{ delete: 2 }, { insert: 'abc' }, { delete: 4 }, { insert: 'def' }]
            expect(doOperation(new Operation(edits), new Operation([])).edits)
                .toEqual(ensureAllAreEdits([{ delete: 6 }, { insert: 'abcdef' }]));
        });

        describe('Moves do not get switched', () => {
            test('With inserts', () => {
                const edits = [{ move: 2 }, { insert: 'abc' }, { move: 4 }]
                expect(doOperation(new Operation(edits), new Operation([])).edits)
                    .toEqual(ensureAllAreEdits([{ move: 2 }, { insert: 'abc' }, { move: 4 }]));
            });

            test('With deletes', () => {
                const edits = [{ move: 2 }, { delete: 3 }, { move: 4 }]
                expect(doOperation(new Operation(edits), new Operation([])).edits)
                    .toEqual(ensureAllAreEdits([{ move: 2 }, { delete: 3 }, { move: 4 }]));
            });
        });
    });

    describe('Combining tests together', () => {
        const combiningTests: {
            description: string,
            edits1: object[],
            edits2: object[],
            result: object[],
            /** When the reverse result is not the same */
            reverseResult?: object[],
            /** The result when extra insert ('aaa') is injected at the start of edits 1 */
            resultWithInsert: object[],
        }[] = [
                {
                    description: 'Combining a delete and a delete: combines the two values',
                    edits1: [{ delete: 2 }],
                    edits2: [{ delete: 3 }],
                    result: [{ delete: 3 }],
                    resultWithInsert: [{ delete: 3 }, { insert: 'aaa' }],
                }, {
                    description: 'Combining a delete and an insert: priotises the delete and then does the insert',
                    edits1: [{ delete: 2 }],
                    edits2: [{ insert: 'abc' }],
                    result: [{ delete: 2 }, { insert: 'abc' }],
                    resultWithInsert: [{ delete: 2 }, { insert: 'aaa' }], // Prioritises the inserted aaa
                }, {
                    description: 'Combining a delete and a move: prioritises the delete and updates the move',
                    edits1: [{ delete: 2 }],
                    edits2: [{ move: 4 }, { delete: 1 }],
                    result: [{ delete: 2 }, { move: 2 }, { delete: 1 }],
                    resultWithInsert: [{ delete: 2 }, { insert: 'aaa' }, { move: 2 }, { delete: 1 }],
                }, {
                    description: 'Combining an insert with an insert',
                    edits1: [{ insert: 'abc' }],
                    edits2: [{ insert: 'def' }],
                    result: [{ insert: 'abc' }],
                    reverseResult: [{ insert: 'def' }],
                    resultWithInsert: [{ insert: 'aaaabc' }],
                }, {
                    description: 'Combining an identical insert: only the one insert is added',
                    edits1: [{ insert: 'abc' }],
                    edits2: [{ insert: 'abc' }],
                    result: [{ insert: 'abc' }],
                    resultWithInsert: [{ insert: 'aaaabc' }],
                }, {
                    description: 'Combining a similar (at start) insert: inserts are combined',
                    edits1: [{ insert: 'abc' }],
                    edits2: [{ insert: 'abcdef' }],
                    result: [{ insert: 'abcdef' }],
                    resultWithInsert: [{ insert: 'aaaabc' }], // No longer similar at the start
                }, {
                    description: 'Combining a similar (in middle) insert: inserts are combined',
                    edits1: [{ insert: 'abcdef' }],
                    edits2: [{ insert: 'cde' }],
                    result: [{ insert: 'abcdef' }],
                    resultWithInsert: [{ insert: 'aaaabcdef' }],
                }, {
                    description: 'Combining a similar (at end) insert: inserts are combined',
                    edits1: [{ insert: 'hello there' }],
                    edits2: [{ insert: 'there' }],
                    result: [{ insert: 'hello there' }],
                    resultWithInsert: [{ insert: 'aaahello there' }],
                }, {
                    description: 'Combining a insert and a move: prioritises the insert and updates the move',
                    edits1: [{ insert: 'abc' }],
                    edits2: [{ move: 4 }, { delete: 1 }],
                    result: [{ insert: 'abc' }, { move: 4 }, { delete: 1 }],
                    resultWithInsert: [{ insert: 'aaaabc' }, { move: 4 }, { delete: 1 }],
                }, {
                    description: 'Combining a move and a move: combines the moves',
                    edits1: [{ move: 8 }, { delete: 1 }],
                    edits2: [{ move: 2 }],
                    result: [{ move: 8 }, { delete: 1 }],
                    resultWithInsert: [{ insert: 'aaa' }, { move: 8 }, { delete: 1 }],
                }, {
                    description: 'Deleting up to a delete still does the second delete',
                    edits1: [{ move: 1 }, { delete: 1 }],
                    edits2: [{ delete: 1 }],
                    result: [{ delete: 1 }, { delete: 1 }],
                    resultWithInsert: [{ delete: 1 }, { insert: 'aaa' }, { delete: 1 }],
                }
            ]

        combiningTests.forEach(t => {
            test(t.description, () => {
                expect(doOperation(new Operation(t.edits1), new Operation(t.edits2)).edits).toEqual(ensureAllAreEdits(t.result));
            });
        });

        describe('Test when the operations are reversed', () => {
            combiningTests.forEach(t => {
                test(t.description, () => {
                    expect(doOperation(new Operation(t.edits2), new Operation(t.edits1)).edits).toEqual(ensureAllAreEdits(t.reverseResult || t.result));
                });
            });
        });

        describe('Test inserting "aaa" at the start of op1', () => {
            combiningTests.forEach(t => {
                test(t.description, () => {
                    expect(doOperation(new Operation([{ insert: 'aaa', }, ...t.edits1]), new Operation(t.edits2)).edits).toEqual(ensureAllAreEdits(t.resultWithInsert));
                });
            });
        })
    });

    describe('Complicated situations', () => {
        test('Do not insert when one operation deletes the location where the other tries to insert', () => {
            const op1 = new Operation([{ delete: 4 }]);
            const op2 = new Operation([{ move: 2 }, { insert: 'abc' }]);
            expect(doOperation(op1, op2).edits).toEqual(ensureAllAreEdits([{ delete: 4 }]));
        });

        test('Do not delete when one operation deletes the location from where the other operation deletes deletes from', () => {
            const op1 = new Operation([{ delete: 4 }]);
            const op2 = new Operation([{ move: 3 }, { delete: 2, }, { insert: 'abc' }]);
            expect(doOperation(op1, op2).edits).toEqual(ensureAllAreEdits([{ delete: 4 }, { move: 1 }, { insert: 'abc' }]));
        });

        test('Do not delete when one operation deletes the location from where the other operation deletes deletes from', () => {
            const op1 = new Operation([{ move: 1 }, { delete: 4 }]);
            const op2 = new Operation([{ move: 4 }, { delete: 2, }, { insert: 'abc' }]);
            expect(doOperation(op1, op2).edits).toEqual(ensureAllAreEdits([{ move: 1 }, { delete: 4 }, { move: 1 }, { insert: 'abc' }]));
        });

        test('Combining multiple inserts and deletes', () => {
            const op1 = new Operation([{ delete: 2 }, { insert: 'abc' }, { delete: 4 }, { insert: 'def' }]);
            const op2 = new Operation([{ insert: 'ab' }, { delete: 8 }, { insert: 'cde' }, { delete: 2 }, { insert: 'fgh' }]);
            expect(doOperation(op1, op2).edits).toEqual(ensureAllAreEdits([{ delete: 10 }, { insert: 'abcdefgh' }]));
        });

        test('Big combination', () => {
            const op1 = new Operation([{ move: 4 }, { insert: 'a' }, { move: 2 }, { delete: 1 }, { move: 2 }, { delete: 1 }]);
            const op2 = new Operation([{ delete: 1 }, { move: 4 }, { delete: 1 }, { insert: 'hi' }]);
            expect(doOperation(op1, op2).edits).toEqual(ensureAllAreEdits([
                { delete: 1 },
                { move: 3 },
                { insert: 'a' },
                { move: 1 },
                { delete: 1 },
                { insert: 'hi' },
                { delete: 1 },
                { move: 2 },
                { delete: 1 },
            ]));
        });

        describe('Negative moves', () => {
            test('Straight forward', () => {
                const op1 = new Operation([{ move: 4 }, { insert: 'a' }, { move: -3 }, { delete: 1 }]);
                const op2 = new Operation([{ move: 5 }, { delete: 1 }, { insert: 'hi' }]);
                expect(doOperation(op1, op2).edits).toEqual(ensureAllAreEdits([
                    { move: 4 },
                    { insert: 'a' },
                    { move: -3 },
                    { delete: 1 },
                    { move: 3 },
                    { delete: 1 },
                    { insert: 'hi' },
                ]));
            });

            test('Edit at the start from other op', () => {
                const op1 = new Operation([{ move: 4 }, { insert: 'a' }, { move: -3 }, { delete: 1 }]);
                const op2 = new Operation([{ delete: 1 }, { move: 4 }, { delete: 1 }, { insert: 'hi' }]);
                expect(doOperation(op1, op2).edits).toEqual(ensureAllAreEdits([
                    { delete: 1 },
                    { move: 3 },
                    { insert: 'a' },
                    { move: -3 },
                    { delete: 1 },
                    { move: 3 },
                    { delete: 1 },
                    { insert: 'hi' },
                ]));
            });

            test('KNOWN FAILURE: After the other operation has done an insert in the middle of the negative move (see reflections in README.md)', () => {
                const op1 = new Operation([{ move: 4 }, { insert: 'a' }, { move: 2 }, { delete: 1 }, { move: -5 }, { delete: 1 }]);
                const op2 = new Operation([{ delete: 1 }, { move: 4 }, { delete: 1 }, { insert: 'hi' }]);
                expect(doOperation(op1, op2).edits).toEqual(ensureAllAreEdits([
                    { delete: 1 },
                    { move: 3 },
                    { insert: 'a' },
                    { move: 1 },
                    { delete: 1 },
                    { insert: 'hi' },
                    { delete: 1 },
                    { move: -7 },
                    { delete: 1 },
                ]));
            });

        });
    });
};
