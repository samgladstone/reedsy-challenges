import Vue from 'vue';
import Vuex from 'vuex';
import books from './books.json';
import { sortByTextProperty, sortByTextYearProperty } from '../helpers';

Vue.use(Vuex);

const PAGE_SIZE = 5;

export const getters = {
    booksSorted: (state, getters) => Object.values(state.books).sort(getters.sortFn(state.sortBy, getters.sortDesc)),
    page: (state, getters) => (
        start => getters.booksSorted.slice(start, start + PAGE_SIZE)
    )((state.pageNumber - 1) * PAGE_SIZE),
    pagesTotal: (s, getters) => Math.ceil((getters.booksSorted.length || 0) / PAGE_SIZE),
    sortFn: state => state.sortBy === 'published' ? sortByTextYearProperty : sortByTextProperty,
    /** Switch it around, but also account for rating being odd in that higher numbers should come first  */
    sortDesc: state => state.sortBy === 'rating' ? state.sortAsc : !state.sortAsc,
}

export const mutations = {
    changeSort(state, { sortAsc, sortBy }) {
        state.sortAsc = sortAsc === !!sortAsc ? sortAsc : state.sortAsc;
        state.sortBy = sortBy || state.sortBy;
    },
};

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        books: books.reduce((all, book) => ({ ...all, [book.id]: book }), {}),
        pageNumber: 1,
        sortAsc: true,
        sortBy: 'rating',
    },
    getters,
    mutations,
});