import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import BooksSortBy from '../BooksSortBy.vue';
import { BOOK_SORTS } from '@/constants';

const localVue = createLocalVue();
localVue.use(Vuex);

let store, changeSort;

const factory = (sortBy = 'rating') => {
    changeSort = jest.fn();
    store = new Vuex.Store({
        state: { sortBy },
        mutations: {
            changeSort
        }
    });

    return shallowMount(BooksSortBy, {
        store, localVue,
    });
}

test('The sort options are available', () => {
    const options = factory().findAll('option');
    expect(options.length).toBe(Object.keys(BOOK_SORTS).length);

    options.wrappers.forEach(o => {
        expect(BOOK_SORTS[o.attributes().value]).toBe(o.text());
        expect(o.text()).toBeDefined();
    });
});

describe("The select's value", () => {
    test('Is set to the store if the value is a sort', () => {
        Object.keys(BOOK_SORTS).forEach(v => {
            expect(factory(v).find('select').element.value).toBe(v);
        })
    });

    test('Is not set to a sort if the stores value is not a valid option', () => {
        expect(Object.keys(BOOK_SORTS)).toContain(factory('not sort').find('select').element.value);
    });

    test('Changing the value calls mutations.changeSort', () => {
        const select = factory().find('select');
        select.setValue('rating');
        expect(changeSort).toBeCalledTimes(1);
        expect(changeSort.mock.calls[0][0]).toEqual({ sortBy: 'rating' });
    });
});