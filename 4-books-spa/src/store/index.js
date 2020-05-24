import Vue from 'vue';
import Vuex from 'vuex';
import books from './books.json';
import { sortByTextProperty, sortByTextYearProperty } from '../helpers';

Vue.use(Vuex);

const PAGE_SIZE = 5;
const calculateTotalPages = (itemCount = 0) => Math.ceil(itemCount / PAGE_SIZE)

export const getters = {
    booksSorted: (state, getters) => Object.values(state.books).sort(getters.sortFn(state.sortBy, getters.sortDesc)),
    page: (state, getters) => (
        start => getters.booksSorted.slice(start, start + PAGE_SIZE)
    )((state.pageNumber - 1) * PAGE_SIZE),
    pagesTotal: (s, getters) => calculateTotalPages(getters.booksSorted.length),
    sortFn: state => state.sortBy === 'published' ? sortByTextYearProperty : sortByTextProperty,
    /** Switch it around, but also account for rating being odd in that higher numbers should come first  */
    sortDesc: state => state.sortBy === 'rating' ? state.sortAsc : !state.sortAsc,
}

export const mutations = {
    changePage(state, { pageNumber }) {
        if (!pageNumber && pageNumber !== 0)
            throw new Error('A new page number is required.');
        if (!Number.isInteger(pageNumber))
            throw new Error('The page number must be an integer.');
        if (pageNumber < 1)
            throw new Error('Cannot go below page 1.');
        if (pageNumber > calculateTotalPages(Object.keys(state.books).length))
            throw new Error('Cannot go beyond the last page.');

        state.pageNumber = pageNumber;
    },
    changeSort(state, { sortAsc, sortBy }) {
        state.sortAsc = sortAsc === !!sortAsc ? sortAsc : state.sortAsc;
        state.sortBy = sortBy || state.sortBy;
    },
};

let id = 1;

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        books: books.reduce((all, book) => ({ ...all, [id]: { id: id++, ...book } }), {}),
        pageNumber: 1,
        sortAsc: true,
        sortBy: 'rating',
    },
    getters,
    mutations,
});