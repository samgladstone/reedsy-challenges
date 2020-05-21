import { sortByTextProperty } from './sorts';

describe('sortByTextProperty', () => {
    let getSortFn = descending => sortByTextProperty('field', descending);

    test('Ascending', () => {
        expect(getSortFn()({ field: 'b' }, { field: 'a' })).toBeGreaterThan(0);
        expect(getSortFn(false)({ field: 'b' }, { field: 'a' })).toBeGreaterThan(0);
    });

    test('Descending', () => {
        expect(getSortFn(true)({ field: 'b' }, { field: 'a' })).toBeLessThan(0);
    });

    test('Equal', () => {
        expect(getSortFn()({ field: 'a' }, { field: 'a' })).toBe(0);
        expect(getSortFn(false)({ field: 'a' }, { field: 'a' })).toBe(0);
        expect(getSortFn(true)({ field: 'a' }, { field: 'a' })).toBe(0);
    });

    test('Ignores capital letters', () => {
        expect(getSortFn()({ field: 'A' }, { field: 'a' })).toBe(0);
        expect(getSortFn()({ field: 'aAa' }, { field: 'aaA' })).toBe(0);
    });

    test('Empty string', () => {
        expect(getSortFn()({ field: '' }, { field: '' })).toBe(0);
        expect(getSortFn()({ field: 'a' }, { field: '' })).toBeGreaterThan(0);
        expect(getSortFn()({ field: '' }, { field: 'a' })).toBeLessThan(0);
    });

    test('No value', () => {
        expect(getSortFn()({ field: 'a' }, {})).toBeLessThan(0);
        expect(getSortFn()({ field: 'a' }, { field: undefined })).toBeLessThan(0);
        expect(getSortFn()({ field: 'a' }, { field: null })).toBeLessThan(0);

        expect(getSortFn()({}, { field: 'a' })).toBeGreaterThan(0);
        expect(getSortFn()({ field: undefined }, { field: 'a' })).toBeGreaterThan(0);
        expect(getSortFn()({ field: null }, { field: 'a' })).toBeGreaterThan(0);

        expect(getSortFn()({ field: null }, { field: undefined })).toBe(0);
        expect(getSortFn()({ field: undefined }, { field: null })).toBe(0);
        expect(getSortFn()({}, { field: undefined })).toBe(0);

        expect(getSortFn()({ field: '' }, {})).toBeLessThan(0);
        expect(getSortFn()({}, { field: '' })).toBeGreaterThan(0);
    });

    test('Other types', () => {
        expect(getSortFn()({ field: '0' }, { field: 1 })).toBeLessThan(0);
        expect(getSortFn()({ field: '1' }, { field: 1 })).toBe(0);
        expect(getSortFn()({ field: '2' }, { field: 1 })).toBeGreaterThan(0);
        expect(getSortFn()({ field: 'a' }, { field: true })).toBeLessThan(0);
        expect(getSortFn()({ field: 'True' }, { field: true })).toBe(0);
        expect(getSortFn()({ field: 'true' }, { field: true })).toBe(0);
    });
});