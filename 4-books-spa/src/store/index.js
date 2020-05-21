import Vue from 'vue';
import Vuex from 'vuex';
import books from './books.json';
import { sortByTextProperty } from '../helpers';

Vue.use(Vuex);

export const getters = {
    booksSorted: state => Object.values(state.books).sort(sortByTextProperty(state.sortBy, !state.sortAsc)),
}

export const mutations = {
    changeSort(state, { sortAsc, sortBy }) {
        state.sortAsc = sortAsc || state.sortAsc;
        state.sortBy = sortBy || state.sortBy;
    },
};

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        books: books.reduce((all, book) => ({ ...all, [book.id]: book }), {}),
        sortAsc: false,
        sortBy: 'rating',
    },
    getters,
    mutations,
});