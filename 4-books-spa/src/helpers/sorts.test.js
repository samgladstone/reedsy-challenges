import { sortByTextProperty, sortByTextYearProperty } from './sorts';

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
        expect(getSortFn()({ field: 'a' }, { field: 'a' }) === 0).toBe(true);
        expect(getSortFn(false)({ field: 'a' }, { field: 'a' }) === 0).toBe(true);
        expect(getSortFn(true)({ field: 'a' }, { field: 'a' }) === 0).toBe(true);
    });

    test('Ignores capital letters', () => {
        expect(getSortFn()({ field: 'A' }, { field: 'a' }) === 0).toBe(true);
        expect(getSortFn()({ field: 'aAa' }, { field: 'aaA' }) === 0).toBe(true);
    });

    test('Empty string', () => {
        expect(getSortFn()({ field: '' }, { field: '' }) === 0).toBe(true)
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

        expect(getSortFn()({ field: null }, { field: undefined }) === 0).toBe(true)
        expect(getSortFn()({ field: undefined }, { field: null }) === 0).toBe(true)
        expect(getSortFn()({}, { field: undefined }) === 0).toBe(true)

        expect(getSortFn()({ field: '' }, {})).toBeLessThan(0);
        expect(getSortFn()({}, { field: '' })).toBeGreaterThan(0);
    });

    test('Other types', () => {
        expect(getSortFn()({ field: '0' }, { field: 1 })).toBeLessThan(0);
        expect(getSortFn()({ field: '1' }, { field: 1 }) === 0).toBe(true)
        expect(getSortFn()({ field: '2' }, { field: 1 })).toBeGreaterThan(0);
        expect(getSortFn()({ field: 'a' }, { field: true })).toBeLessThan(0);
        expect(getSortFn()({ field: 'True' }, { field: true }) === 0).toBe(true)
        expect(getSortFn()({ field: 'true' }, { field: true }) === 0).toBe(true)
    });
});

describe('sortByTextYearProperty', () => {
    let getSortFn = descending => sortByTextYearProperty('field', descending);

    test('Ascending', () => {
        expect(getSortFn()({ field: '2020' }, { field: '2019' })).toBeGreaterThan(0);
        expect(getSortFn(false)({ field: '2020' }, { field: '2019' })).toBeGreaterThan(0);
    });

    test('Descending', () => {
        expect(getSortFn(true)({ field: '2020' }, { field: '2019' })).toBeLessThan(0);
    });

    test('Equal', () => {
        expect(getSortFn()({ field: '2020' }, { field: '2020' }) === 0).toBe(true);
        expect(getSortFn(false)({ field: '2020' }, { field: '2020' }) === 0).toBe(true);
        expect(getSortFn(true)({ field: '2020' }, { field: '2020' }) === 0).toBe(true);
    });

    test('No value', () => {
        expect(getSortFn()({ field: '2020' }, {})).toBeLessThan(0);
        expect(getSortFn()({ field: '2020' }, { field: undefined })).toBeLessThan(0);
        expect(getSortFn()({ field: '2020' }, { field: null })).toBeLessThan(0);

        expect(getSortFn()({}, { field: '2020' })).toBeGreaterThan(0);
        expect(getSortFn()({ field: undefined }, { field: '2020' })).toBeGreaterThan(0);
        expect(getSortFn()({ field: null }, { field: '2020' })).toBeGreaterThan(0);

        expect(getSortFn()({ field: null }, { field: undefined }) === 0).toBe(true)
        expect(getSortFn()({ field: undefined }, { field: null }) === 0).toBe(true)
        expect(getSortFn()({}, { field: undefined }) === 0).toBe(true)

        expect(getSortFn()({ field: '' }, {}) === 0).toBe(true);
        expect(getSortFn()({}, { field: '' }) === 0).toBe(true);
    });

    test('Can compare to numbers types', () => {
        expect(getSortFn()({ field: '2019' }, { field: 2020 })).toBeLessThan(0);
        expect(getSortFn()({ field: '2020' }, { field: 2020 }) === 0).toBe(true)
        expect(getSortFn()({ field: '2020' }, { field: 2019 })).toBeGreaterThan(0);
    });

    test("Sorts '800' before '1100' as this would not happen with string compare", () => {
        expect(getSortFn()({ field: '800' }, { field: '1100' })).toBeLessThan(0);
    })

    describe('Sorts BCE years properly', () => {
        test('Identifies BCE years', () => {
            expect(getSortFn()({ field: '2020 BC' }, { field: '2019' })).toBeLessThan(0);
            expect(getSortFn()({ field: '2020 BCE' }, { field: '2019' })).toBeLessThan(0);
            expect(getSortFn()({ field: '2020 B.C.' }, { field: '2019' })).toBeLessThan(0);
            expect(getSortFn()({ field: '2020 B.C.E.' }, { field: '2019' })).toBeLessThan(0);
        });

        describe('Correct directions, NB: that BCE years are reversed in direction as they count in the opposite direction', () => {
            test('Ascending', () => {
                expect(getSortFn()({ field: '2020 BCE' }, { field: '2019 BCE' })).toBeLessThan(0);
                expect(getSortFn(false)({ field: '2020 BCE' }, { field: '2019 BCE' })).toBeLessThan(0);
            });

            test('Descending', () => {
                expect(getSortFn(true)({ field: '2020 BCE' }, { field: '2019 BCE' })).toBeGreaterThan(0);
            });

            test('Equal', () => {
                expect(getSortFn()({ field: '2020 BCE' }, { field: '2020 BCE' }) === 0).toBe(true);
                expect(getSortFn(false)({ field: '2020 BCE' }, { field: '2020 BCE' }) === 0).toBe(true);
                expect(getSortFn(true)({ field: '2020 BCE' }, { field: '2020 BCE' }) === 0).toBe(true);
                expect(getSortFn(true)({ field: '2020 BCE' }, { field: '2020 BC' }) === 0).toBe(true);
            });
        });
    });

    describe('Sorts non dates to the end', () => {
        test('Identifies Dates', () => {
            expect(getSortFn()({ field: '2019' }, { field: '2020' })).toBeLessThan(0);

            expect(getSortFn()({ field: '2019BC' }, { field: '2020' })).toBeLessThan(0);
            expect(getSortFn()({ field: '2019B.C.' }, { field: '2020' })).toBeLessThan(0);
            expect(getSortFn()({ field: '2019 BC' }, { field: '2020' })).toBeLessThan(0);
            expect(getSortFn()({ field: '2019 B.C.' }, { field: '2020' })).toBeLessThan(0);

            expect(getSortFn()({ field: '2019AD' }, { field: '2020' })).toBeLessThan(0);
            expect(getSortFn()({ field: '2019AD.' }, { field: '2020' })).toBeLessThan(0);
            expect(getSortFn()({ field: '2019 AD' }, { field: '2020' })).toBeLessThan(0);
            expect(getSortFn()({ field: '2019 A.D.' }, { field: '2020' })).toBeLessThan(0);

            expect(getSortFn()({ field: '2019BCE' }, { field: '2020' })).toBeLessThan(0);
            expect(getSortFn()({ field: '2019B.C.E.' }, { field: '2020' })).toBeLessThan(0);
            expect(getSortFn()({ field: '2019 BCE' }, { field: '2020' })).toBeLessThan(0);
            expect(getSortFn()({ field: '2019 B.C.E.' }, { field: '2020' })).toBeLessThan(0);

            expect(getSortFn()({ field: '2019CE' }, { field: '2020' })).toBeLessThan(0);
            expect(getSortFn()({ field: '2019C.E.' }, { field: '2020' })).toBeLessThan(0);
            expect(getSortFn()({ field: '2019 CE' }, { field: '2020' })).toBeLessThan(0);
            expect(getSortFn()({ field: '2019 C.E.' }, { field: '2020' })).toBeLessThan(0);
        });

        test('Identifies Dates', () => {
            expect(getSortFn()({ field: true }, { field: '2020' })).toBeGreaterThan(0);
            expect(getSortFn()({ field: 'Twenty-Nineteen' }, { field: '2020' })).toBeGreaterThan(0);
            expect(getSortFn()({ field: 'Some text' }, { field: '2020' })).toBeGreaterThan(0);
            expect(getSortFn()({ field: '2019 BCD' }, { field: '2020' })).toBeGreaterThan(0);
            expect(getSortFn()({ field: '2019 ADE' }, { field: '2020' })).toBeGreaterThan(0);
            expect(getSortFn()({ field: '2019 CCE' }, { field: '2020' })).toBeGreaterThan(0);
        });
    })
});