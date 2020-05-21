import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import App from '@/App.vue';
import BookRow from '@/components/BookRow.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

let store, booksSorted, booksSortedGetter;

beforeEach(() => {
    booksSorted = [
        { id: 1 },
        { id: 3 },
        { id: 2 },
        { id: 5 },
    ];

    booksSortedGetter = jest.fn().mockReturnValue(booksSorted)

    store = new Vuex.Store({
        getters: {
            booksSorted: booksSortedGetter
        }
    })
})

const factory = () => {
    return shallowMount(App, {
        store, localVue,
    });
};

test('The books list is correctly added', () => {
    const wrapper = factory();

    expect(booksSortedGetter).toBeCalledTimes(1);
    expect(wrapper.vm.books).toBe(booksSorted);
});

test('The correct books are rendered', () => {
    const wrappers = factory().findAllComponents(BookRow);

    expect(wrappers.length).toBe(4);
    expect(wrappers.at(0).vm.bookId).toBe(1);
    expect(wrappers.at(1).vm.bookId).toBe(3);
    expect(wrappers.at(2).vm.bookId).toBe(2);
    expect(wrappers.at(3).vm.bookId).toBe(5);
});