import editFactory from './editFactory';

import Delete from './Delete';
import Insert from './Insert';
import Move from './Move';

describe('Delete', () => {
    test('Returns the passed in object if it an instance of Delete', () => {
        const deleteOp = new Delete(4);
        expect(editFactory(deleteOp)).toBe(deleteOp);
    });

    test('Creates a new instance of Delete if possible', () => {
        const deleteOp = <Delete>editFactory({ delete: 8 });
        expect(deleteOp).toBeInstanceOf(Delete);
        expect(deleteOp.delete).toBe(8);
    });
});

describe('Insert', () => {
    test('Returns the passed in object if it an instance of Insert', () => {
        const insert = new Insert('abc');
        expect(editFactory(insert)).toBe(insert);
    });

    test('Creates a new instance of Insert if possible', () => {
        const insert = <Insert>editFactory({ insert: 'Why hello there....' });
        expect(insert).toBeInstanceOf(Insert);
        expect(insert.insert).toBe('Why hello there....');
    });
});

describe('Move', () => {
    test('Returns the passed in object if it an instance of Move', () => {
        const move = new Move(4);
        expect(editFactory(move)).toBe(move);
    });

    test('Creates a new instance of Move if possible', () => {
        const move = <Move>editFactory({ move: 8 });
        expect(move).toBeInstanceOf(Move);
        expect(move.move).toBe(8);
    });
});

describe("Values that aren't edits should return undefined", () => {
    test('Empty object', () => {
        expect(editFactory({})).toBeUndefined();
    });

    test('Invalid Values', () => {
        expect(editFactory({ replace: 'abc' })).toBeUndefined();
        expect(editFactory({ insert: 4 })).toBeUndefined();
        expect(editFactory({ delete: 'Hey' })).toBeUndefined();
    });

    test('Undefined', () => {
        expect(editFactory(<any>undefined)).toBeUndefined();
    });

    test('Null', () => {
        expect(editFactory(<any>null)).toBeUndefined();
    });

    test('String', () => {
        expect(editFactory(<any>'Hey there')).toBeUndefined();
    });

    test('Number', () => {
        expect(editFactory(<any>-12345.7643)).toBeUndefined();
    });

    test('Boolean', () => {
        expect(editFactory(<any>true)).toBeUndefined();
    });

    test('Array', () => {
        expect(editFactory(<any>[])).toBeUndefined();
    });
});