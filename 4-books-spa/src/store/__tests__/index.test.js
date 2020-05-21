import store, { mutations, getters } from '../index';
import { BOOK_SORTS } from '../../constants';

describe('Getters', () => {
    describe('booksSorted', () => {
        let mockBooksSorted = (sortAsc, sortBy) => getters.booksSorted({
            books: {
                1: {
                    "id": 1,
                    "author": "Markus Zusak",
                    "rating": "9.9",
                    "published": "2005",
                    "title": "The Book Thief",
                },
                2: {
                    "id": 2,
                    "author": "David Eagleman",
                    "rating": "9.8",
                    "published": "2009",
                    "title": "Sum: Forty Tales from the Afterlives",

                },
                3: {
                    "id": 3,
                    "author": "Matt Haig",
                    "rating": "9.7",
                    "published": "2013",
                    "title": "The Humans",
                }
            },
            sortAsc,
            sortBy,
        });

        test('Default sort settings', () => {
            expect(store.state.sortAsc).toBe(false);
            expect(store.state.sortBy).toBe('rating');
        });

        Object.keys(BOOK_SORTS).forEach(sort => {
            describe(`Sort by ${sort}`, () => {
                test('Ascending', () => { expect(mockBooksSorted(true, sort)).toMatchSnapshot(); });
                test('Descending', () => { expect(mockBooksSorted(false, sort)).toMatchSnapshot(); });
            });
        });
    });
});

describe('Mutations', () => {
    describe('changeSort', () => {
        let changeSort, mockState;

        beforeAll(() => { changeSort = mutations.changeSort });

        beforeEach(() => {
            mockState = {
                sortAsc: false,
                sortBy: 'rating',
            }
        });

        test('The sort order can be changed', () => {
            changeSort(mockState, { sortAsc: true });
            expect(mockState.sortAsc).toBe(true);
            expect(mockState.sortBy).toBe('rating');
        });

        test('The sort by can be changed', () => {
            changeSort(mockState, { sortBy: 'author' });
            expect(mockState.sortAsc).toBe(false);
            expect(mockState.sortBy).toBe('author');
        });

        test('Sort by and direction can be updated together', () => {
            changeSort(mockState, { sortAsc: true, sortBy: 'author' });
            expect(mockState.sortAsc).toBe(true);
            expect(mockState.sortBy).toBe('author');
        });

        test('Not passing in a sort by or order preserves the original state', () => {
            changeSort(mockState, {});
            expect(mockState.sortAsc).toBe(false);
            expect(mockState.sortBy).toBe('rating');
        });
    });
});