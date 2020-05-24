import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import BooksSortDirection from '../BooksSortDirection.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

let store, changeSort;

const factory = (sortAsc = false) => {
    changeSort = jest.fn().mockImplementation((state, { sortAsc }) => {
        state.sortAsc = sortAsc;
    });

    store = new Vuex.Store({
        state: { sortAsc },
        mutations: {
            changeSort
        }
    });

    return shallowMount(BooksSortDirection, {
        store, localVue,
    });
}

describe("The context is set by the store's value", () => {
    describe('Ascending', () => {
        test('Button title', () => {
            expect(factory(true).find('button').attributes().title)
                .toBe('Click to change to descending order');
        });

        describe('Image attributes', () => {
            // I don't know how to test this
            test.todo('src');

            test('alt', () => {
                expect(factory(true).find('img').attributes().alt)
                    .toBe('Sorted in ascending order');
            });
        })
    });

    describe('Descending', () => {
        test('Button title', () => {
            expect(factory(false).find('button').attributes().title)
                .toBe('Click to change to ascending order');
        });

        describe('Image attributes', () => {
            // I don't know how to test this
            test.todo('src');

            test('alt', () => {
                expect(factory(false).find('img').attributes().alt)
                    .toBe('Sorted in descending order');
            });
        })
    });
});

test('Changing the button calls mutations.changeSort', () => {
    const btn = factory().find('button');
    btn.trigger('click');
    expect(changeSort).toBeCalledTimes(1);
    expect(changeSort.mock.calls[0][0]).toEqual({ sortAsc: true });

    btn.trigger('click');
    expect(changeSort).toBeCalledTimes(2);
    expect(changeSort.mock.calls[1][0]).toEqual({ sortAsc: false });
});