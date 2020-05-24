import store, { mutations, getters } from '../index';
import { BOOK_SORTS } from '@/constants';
import { sortByTextProperty, sortByTextYearProperty } from '@/helpers';

let mockBooksSorted = bookCount => new Array(bookCount).fill('').map((n, i) => ({ id: i, title: 'avc' }));

describe('Getters', () => {
    describe('booksSorted', () => {
        let sortFn, sortDescGet;

        const mockBooksSorted = (sortAsc, sortBy) => {
            sortFn = jest.fn().mockImplementation(getters.sortFn({ sortBy }));
            sortDescGet = jest.fn(() => !sortAsc);

            const mockGetters = { sortFn };
            Object.defineProperty(mockGetters, 'sortDesc', {
                get: sortDescGet
            });

            return getters.booksSorted({
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
            }, mockGetters);
        }

        test('Default sort settings', () => {
            expect(store.state.sortAsc).toBe(true);
            expect(store.state.sortBy).toBe('rating');
        });

        test('Sets up the sortFn correctly', () => {
            mockBooksSorted(true, 'rating');
            expect(sortFn).toBeCalledTimes(1);
            expect(sortFn).lastCalledWith('rating', false);

            mockBooksSorted(false, 'author');
            expect(sortFn).toBeCalledTimes(1);
            expect(sortFn).lastCalledWith('author', true);
        });

        Object.keys(BOOK_SORTS).forEach(sort => {
            describe(`Sort by ${sort}`, () => {
                test('Ascending', () => { expect(mockBooksSorted(true, sort)).toMatchSnapshot(); });
                test('Descending', () => { expect(mockBooksSorted(false, sort)).toMatchSnapshot(); });
            });
        });
    });

    describe('booksPage', () => {
        let mockPage = (pageNumber, booksSorted) => getters.page({ pageNumber }, { booksSorted });
        let mockBooksSortedPages = pageCount => mockBooksSorted(pageCount * 5);

        describe('Gets the correct page', () => {
            test('Page length is 5', () => {
                expect(mockPage(1, mockBooksSortedPages(3)).length).toBe(5);
                expect(mockPage(2, mockBooksSortedPages(3)).length).toBe(5);
                expect(mockPage(3, mockBooksSortedPages(3)).length).toBe(5);
                expect(mockPage(25, mockBooksSortedPages(50)).length).toBe(5);
            })

            test('Page 1 of 3', () => {
                const booksSorted = mockBooksSortedPages(3);
                const page = mockPage(1, booksSorted);
                expect(page[0]).toBe(booksSorted[0]);
                expect(page[1]).toBe(booksSorted[1]);
                expect(page[2]).toBe(booksSorted[2]);
                expect(page[3]).toBe(booksSorted[3]);
                expect(page[4]).toBe(booksSorted[4]);
            });

            test('Page 2 of 3', () => {
                const booksSorted = mockBooksSortedPages(3);
                const page = mockPage(2, booksSorted);
                expect(page[0]).toBe(booksSorted[5]);
                expect(page[1]).toBe(booksSorted[6]);
                expect(page[2]).toBe(booksSorted[7]);
                expect(page[3]).toBe(booksSorted[8]);
                expect(page[4]).toBe(booksSorted[9]);
            });

            test('Page 3 of 3', () => {
                const booksSorted = mockBooksSortedPages(3);
                const page = mockPage(3, booksSorted);
                expect(page[0]).toBe(booksSorted[10]);
                expect(page[1]).toBe(booksSorted[11]);
                expect(page[2]).toBe(booksSorted[12]);
                expect(page[3]).toBe(booksSorted[13]);
                expect(page[4]).toBe(booksSorted[14]);
            });

            test('Page 44 of 100', () => {
                const booksSorted = mockBooksSortedPages(100);
                const page = mockPage(44, booksSorted);
                expect(page[0]).toBe(booksSorted[215]);
                expect(page[1]).toBe(booksSorted[216]);
                expect(page[2]).toBe(booksSorted[217]);
                expect(page[3]).toBe(booksSorted[218]);
                expect(page[4]).toBe(booksSorted[219]);
            });

            test('Page 3 of 2.4', () => {
                const booksSorted = mockBooksSorted(12);
                const page = mockPage(3, booksSorted);
                expect(page.length).toBe(2);
                expect(page[0]).toBe(booksSorted[10]);
                expect(page[1]).toBe(booksSorted[11]);
            });
        });

        describe('Returns an empty array if there are no elements', () => {
            test('Page 0', () => {
                expect(mockPage(0, mockBooksSortedPages(3)).length).toBe(0);
            });

            test('Page higher than total', () => {
                expect(mockPage(4, mockBooksSortedPages(3)).length).toBe(0);
            });
        });

    });

    describe('pagesTotal', () => {
        let mockPagesCount = bookCount => getters.pagesTotal({}, { booksSorted: mockBooksSorted(bookCount) });

        test('Full pages', () => {
            expect(mockPagesCount(5)).toBe(1);
            expect(mockPagesCount(10)).toBe(2);
            expect(mockPagesCount(100)).toBe(20);
        });

        test('Partial pages', () => {
            expect(mockPagesCount(1)).toBe(1);
            expect(mockPagesCount(2)).toBe(1);
            expect(mockPagesCount(3)).toBe(1);
            expect(mockPagesCount(4)).toBe(1);
            expect(mockPagesCount(6)).toBe(2);
            expect(mockPagesCount(98)).toBe(20);
        });

        test('No pages', () => {
            expect(mockPagesCount(0)).toBe(0);
        });
    });

    describe('sortFn', () => {
        test('Sorts using text year for published', () => {
            expect(getters.sortFn({ sortBy: 'published' })).toBe(sortByTextYearProperty);
        });

        Object.keys(BOOK_SORTS).filter(sort => sort !== 'published').forEach(sortBy => {
            test(`Sorts using text for ${sortBy}`, () => {
                expect(getters.sortFn({ sortBy })).toBe(sortByTextProperty);
            });
        });
    });

    describe('sortDirection', () => {
        test('Sorts using text year for published', () => {
            expect(getters.sortFn({ sortBy: 'published' })).toBe(sortByTextYearProperty);
        });

        Object.keys(BOOK_SORTS).filter(sort => sort !== 'published').forEach(sortBy => {
            test(`Sorts using text for ${sortBy}`, () => {
                expect(getters.sortFn({ sortBy })).toBe(sortByTextProperty);
            });
        });
    });
});

describe('Mutations', () => {
    describe('changePage', () => {
        let changePage, mockState;

        beforeAll(() => { changePage = mutations.changePage });
        beforeEach(() => {
            mockState = {
                pageNumber: 1,
                books: mockBooksSorted(50).reduce((all, b) => ({ ...all, [b.id]: b }), {})
            }
        });

        test('The page number is set', () => {
            changePage(mockState, { pageNumber: 1 });
            expect(mockState.pageNumber).toBe(1);
            changePage(mockState, { pageNumber: 2 });
            expect(mockState.pageNumber).toBe(2);
            changePage(mockState, { pageNumber: 5 });
            expect(mockState.pageNumber).toBe(5);
            changePage(mockState, { pageNumber: 9 });
            expect(mockState.pageNumber).toBe(9);
            changePage(mockState, { pageNumber: 10 }); // Maxmimum page is 10
            expect(mockState.pageNumber).toBe(10);
        });

        test('The page number cannot be set to less than 0', () => {
            const err = 'Cannot go below page 1.';
            expect(() => changePage(mockState, { pageNumber: 1 })).not.toThrow(err);
            expect(() => changePage(mockState, { pageNumber: 0 })).toThrow(err);
            expect(() => changePage(mockState, { pageNumber: -1 })).toThrow(err);
            expect(() => changePage(mockState, { pageNumber: -1000 })).toThrow(err);
        });

        test('The page number cannot be higher than the total pages', () => {
            const err = 'Cannot go beyond the last page.';
            expect(() => changePage(mockState, { pageNumber: 10 })).not.toThrow(err);
            expect(() => changePage(mockState, { pageNumber: 11 })).toThrow(err);
            expect(() => changePage(mockState, { pageNumber: 12 })).toThrow(err);
            expect(() => changePage(mockState, { pageNumber: 500 })).toThrow(err);
        });

        test('A page number must be included', () => {
            const err = 'A new page number is required.';
            expect(() => changePage(mockState, {})).toThrow(err);
            expect(() => changePage(mockState, { pageNumber: null })).toThrow(err);
            expect(() => changePage(mockState, { pageNumber: undefined })).toThrow(err);
            expect(() => changePage(mockState, { pageNumber: '' })).toThrow(err);
        });

        test('Page number must be a number', () => {
            const err = 'The page number must be an integer.';
            expect(() => changePage(mockState, { pageNumber: true })).toThrow(err);
            expect(() => changePage(mockState, { pageNumber: 'abc' })).toThrow(err);
            expect(() => changePage(mockState, { pageNumber: 1.1 })).toThrow(err);
        });
    });

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
            changeSort(mockState, { sortAsc: false });
            expect(mockState.sortAsc).toBe(false);
            expect(mockState.sortBy).toBe('rating');
        });

        test('The sort by can be changed', () => {
            changeSort(mockState, { sortBy: 'author' });
            expect(mockState.sortAsc).toBe(false);
            expect(mockState.sortBy).toBe('author');
            changeSort(mockState, { sortBy: 'rating' });
            expect(mockState.sortAsc).toBe(false);
            expect(mockState.sortBy).toBe('rating');
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