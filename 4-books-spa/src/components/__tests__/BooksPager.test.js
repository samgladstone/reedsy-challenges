import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import BooksPager from '../BooksPager.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

let store, changePage;

const factory = (pageNumber = 1, pagesTotal = 10) => {
    changePage = jest.fn();
    store = new Vuex.Store({
        state: { pageNumber },
        getters: { pagesTotal: () => pagesTotal },
        mutations: {
            changePage
        }
    });

    return shallowMount(BooksPager, {
        store, localVue,
    });
}

describe('Previous page', () => {
    const selector = '.prev';
    describe('10 Page Test', () => {
        describe('Previous page on page 1', () => {
            let wrapper;
            beforeAll(() => { wrapper = factory(1).find(selector) });

            test('Included', () => {
                expect(wrapper.exists()).toBe(true);
            });

            test('Disabled', () => {
                expect(wrapper.attributes().disabled).toBeTruthy();
            });

            test('Clicking does nothing', () => {
                wrapper.trigger('click');
                expect(changePage).not.toHaveBeenCalled();
            });
        });

        describe('Previous page on page 2', () => {
            let wrapper;
            beforeAll(() => { wrapper = factory(2).find(selector) });

            test('Included', () => {
                expect(wrapper.exists()).toBe(true);
            });

            test('Disabled', () => {
                expect(wrapper.attributes().disabled).toBeFalsy();
            });

            test('Clicking changes to page 1', () => {
                wrapper.trigger('click');
                expect(changePage).toHaveBeenCalledTimes(1);
                expect(changePage).lastCalledWith(expect.any(Object), { pageNumber: 1 });
            });
        });

        describe('Previous page on page 3', () => {
            let wrapper;
            beforeAll(() => { wrapper = factory(3).find(selector) });

            test('Included', () => {
                expect(wrapper.exists()).toBe(true);
            });

            test('Disabled', () => {
                expect(wrapper.attributes().disabled).toBeFalsy();
            });

            test('Clicking changes to page 2', () => {
                wrapper.trigger('click');
                expect(changePage).toHaveBeenCalledTimes(1);
                expect(changePage).lastCalledWith(expect.any(Object), { pageNumber: 2 });
            });
        });

        describe('Previous page on page 4', () => {
            let wrapper;
            beforeAll(() => { wrapper = factory(4).find(selector) });

            test('Included', () => {
                expect(wrapper.exists()).toBe(true);
            });

            test('Disabled', () => {
                expect(wrapper.attributes().disabled).toBeFalsy();
            });

            test('Clicking changes to page 3', () => {
                wrapper.trigger('click');
                expect(changePage).toHaveBeenCalledTimes(1);
                expect(changePage).lastCalledWith(expect.any(Object), { pageNumber: 3 });
            });
        });

        describe('Previous page on page 5', () => {
            let wrapper;
            beforeAll(() => { wrapper = factory(5).find(selector) });

            test('Included', () => {
                expect(wrapper.exists()).toBe(true);
            });

            test('Disabled', () => {
                expect(wrapper.attributes().disabled).toBeFalsy();
            });

            test('Clicking changes to page 4', () => {
                wrapper.trigger('click');
                expect(changePage).toHaveBeenCalledTimes(1);
                expect(changePage).lastCalledWith(expect.any(Object), { pageNumber: 4 });
            });
        });

        describe('Previous page on page 6', () => {
            let wrapper;
            beforeAll(() => { wrapper = factory(6).find(selector) });

            test('Included', () => {
                expect(wrapper.exists()).toBe(true);
            });

            test('Disabled', () => {
                expect(wrapper.attributes().disabled).toBeFalsy();
            });

            test('Clicking changes to page 5', () => {
                wrapper.trigger('click');
                expect(changePage).toHaveBeenCalledTimes(1);
                expect(changePage).lastCalledWith(expect.any(Object), { pageNumber: 5 });
            });
        });

        describe('Previous page on page 7', () => {
            let wrapper;
            beforeAll(() => { wrapper = factory(7).find(selector) });

            test('Included', () => {
                expect(wrapper.exists()).toBe(true);
            });

            test('Disabled', () => {
                expect(wrapper.attributes().disabled).toBeFalsy();
            });

            test('Clicking changes to page 6', () => {
                wrapper.trigger('click');
                expect(changePage).toHaveBeenCalledTimes(1);
                expect(changePage).lastCalledWith(expect.any(Object), { pageNumber: 6 });
            });
        });

        describe('Previous page on page 8', () => {
            let wrapper;
            beforeAll(() => { wrapper = factory(8).find(selector) });

            test('Included', () => {
                expect(wrapper.exists()).toBe(true);
            });

            test('Disabled', () => {
                expect(wrapper.attributes().disabled).toBeFalsy();
            });

            test('Clicking changes to page 7', () => {
                wrapper.trigger('click');
                expect(changePage).toHaveBeenCalledTimes(1);
                expect(changePage).lastCalledWith(expect.any(Object), { pageNumber: 7 });
            });
        });

        describe('Previous page on page 9', () => {
            let wrapper;
            beforeAll(() => { wrapper = factory(9).find(selector) });

            test('Included', () => {
                expect(wrapper.exists()).toBe(true);
            });

            test('Disabled', () => {
                expect(wrapper.attributes().disabled).toBeFalsy();
            });

            test('Clicking changes to page 8', () => {
                wrapper.trigger('click');
                expect(changePage).toHaveBeenCalledTimes(1);
                expect(changePage).lastCalledWith(expect.any(Object), { pageNumber: 8 });

            });
        });

        describe('Previous page on page 10', () => {
            let wrapper;
            beforeAll(() => { wrapper = factory(10).find(selector) });

            test('Included', () => {
                expect(wrapper.exists()).toBe(true);
            });

            test('Disabled', () => {
                expect(wrapper.attributes().disabled).toBeFalsy();
            });

            test('Clicking changes to page 9', () => {
                wrapper.trigger('click');
                expect(changePage).toHaveBeenCalledTimes(1);
                expect(changePage).lastCalledWith(expect.any(Object), { pageNumber: 9 });
            });
        });
    });
});

describe('First page', () => {
    const selector = '.first';
    describe('10 Page Test', () => {
        test('First page is not on page 1', () => {
            expect(factory(1).find(selector).exists()).toBe(false);
        });

        test('First page is not on page 2', () => {
            expect(factory(2).find(selector).exists()).toBe(false);
        });

        test('First page is not on page 3', () => {
            expect(factory(3).find(selector).exists()).toBe(false);
        });

        test('First page is on page 4 and links to page 1', () => {
            const wrapper = factory(4).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(1);
        });

        describe('First page is on page 5 and links to page 1', () => {
            const wrapper = factory(5).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(1);
        });

        describe('First page is on page 6 and links to page 1', () => {
            const wrapper = factory(6).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(1);
        });

        describe('First page is on page 7 and links to page 1', () => {
            const wrapper = factory(7).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(1);
        });

        describe('First page is on page 8 and links to page 1', () => {
            const wrapper = factory(8).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(1);
        });

        describe('First page on page 9 and links to page 1', () => {
            const wrapper = factory(9).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(1);
        });

        describe('First page is on page 10 and links to page 1', () => {
            const wrapper = factory(10).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(1);
        });
    });
});

describe('Current - 2', () => {
    const selector = '.pn-minus-2';
    describe('10 Page Test', () => {
        test('Current - 2 is not on page 1', () => {
            expect(factory(1).find(selector).exists()).toBe(false);
        });

        test('Current - 2 is not on page 2', () => {
            expect(factory(2).find(selector).exists()).toBe(false);
        });

        test('Current - 2 is on page 3 and links to page 1', () => {
            const wrapper = factory(3).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(1);
        });

        test('Current - 2 is on page 4 and links to page 2', () => {
            const wrapper = factory(4).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(2);
        });

        test('Current - 2 is on page 5 and links to page 3', () => {
            const wrapper = factory(5).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(3);
        });

        test('Current - 2 is on page 6 and links to page 4', () => {
            const wrapper = factory(6).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(4);
        });

        test('Current - 2 is on page 7 and links to page 5', () => {
            const wrapper = factory(7).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(5);
        });

        test('Current - 2 is on page 8 and links to page 6', () => {
            const wrapper = factory(8).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(6);
        });

        test('Current - 2 is on page 9 and links to page 7', () => {
            const wrapper = factory(9).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(7);
        });

        test('Current - 2 is on page 10 and links to page 8', () => {
            const wrapper = factory(10).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(8);
        });
    });
});

describe('Current - 1', () => {
    const selector = '.pn-minus-1';
    describe('10 Page Test', () => {
        test('Current -1 is not on page 1', () => {
            expect(factory(1).find(selector).exists()).toBe(false);
        });

        test('Current -1 is on page 2 and links to page 1', () => {
            const wrapper = factory(2).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(1);
        });

        test('Current -1 is on page 3 and links to page 2', () => {
            const wrapper = factory(3).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(2);
        });

        test('Current -1 is on page 4 and links to page 3', () => {
            const wrapper = factory(4).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(3);
        });

        test('Current -1 is on page 5 and links to page 4', () => {
            const wrapper = factory(5).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(4);
        });

        test('Current -1 is on page 6 and links to page 5', () => {
            const wrapper = factory(6).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(5);
        });

        test('Current -1 is on page 7 and links to page 6', () => {
            const wrapper = factory(7).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(6);
        });

        test('Current -1 is on page 8 and links to page 7', () => {
            const wrapper = factory(8).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(7);
        });

        test('Current -1 is on page 9 and links to page 8', () => {
            const wrapper = factory(9).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(8);
        });

        test('Current -1 is on page 10 and links to page 9', () => {
            const wrapper = factory(10).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(9);
        });
    });
});

describe('Current Page', () => {
    const selector = '.current-page';
    describe('10 Page Test', () => {
        for (let i = 0; i < 11; i++) {
            test(`Current page is on page ${i}, is page ${i} and is disabled`, () => {
                const wrapper = factory(i).find(selector);

                expect(wrapper.exists()).toBe(true);
                expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
                expect(wrapper.vm.pageNumber).toBe(i);
                expect(wrapper.attributes().disabled).toBe(''); // this means set
            });
        }
    });
});

describe('Current + 1', () => {
    const selector = '.pn-plus-1';
    describe('10 Page Test', () => {
        test('Current + 1 is on page 1 and links to page 2', () => {
            const wrapper = factory(1).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(2);
        });

        test('Current + 1 is on page 2 and links to page 3', () => {
            const wrapper = factory(2).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(3);
        });

        test('Current + 1 is on page 3 and links to page 4', () => {
            const wrapper = factory(3).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(4);
        });

        test('Current + 1 is on page 4 and links to page 5', () => {
            const wrapper = factory(4).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(5);
        });

        test('Current + 1 is on page 5 and links to page 6', () => {
            const wrapper = factory(5).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(6);
        });

        test('Current + 1 is on page 6 and links to page 7', () => {
            const wrapper = factory(6).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(7);
        });

        test('Current + 1 is on page 7 and links to page 8', () => {
            const wrapper = factory(7).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(8);
        });

        test('Current + 1 is on page 8 and links to page 9', () => {
            const wrapper = factory(8).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(9);
        });

        test('Current + 1 is on page 9 and links to page 10', () => {
            const wrapper = factory(9).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(10);
        });

        test('Current + 1 is not on page 10', () => {
            expect(factory(10).find(selector).exists()).toBe(false);
        });
    });
});

describe('Current + 2', () => {
    const selector = '.pn-plus-2';
    describe('10 Page Test', () => {
        test('Current + 2 is on page 1 and links to page 3', () => {
            const wrapper = factory(1).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(3);
        });

        test('Current + 2 is on page 2 and links to page 4', () => {
            const wrapper = factory(2).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(4);
        });

        test('Current + 2 is on page 3 and links to page 5', () => {
            const wrapper = factory(3).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(5);
        });

        test('Current + 2 is on page 4 and links to page 6', () => {
            const wrapper = factory(4).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(6);
        });

        test('Current + 2 is on page 5 and links to page 7', () => {
            const wrapper = factory(5).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(7);
        });

        test('Current + 2 is on page 6 and links to page 8', () => {
            const wrapper = factory(6).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(8);
        });

        test('Current + 2 is on page 7 and links to page 9', () => {
            const wrapper = factory(7).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(9);
        });

        test('Current + 2 is on page 8 and links to page 10', () => {
            const wrapper = factory(8).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(10);
        });

        test('Current + 2 is not on page 9', () => {
            expect(factory(9).find(selector).exists()).toBe(false);
        });

        test('Current + 2 is not on page 10', () => {
            expect(factory(10).find(selector).exists()).toBe(false);
        });
    });
});

describe('Last page', () => {
    const selector = '.last';
    describe('10 Page Test', () => {
        test('Last page is on page 1 and links to page 10', () => {
            const wrapper = factory(1).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(10);
        });

        test('Last page is on page 2 and links to page 10', () => {
            const wrapper = factory(2).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(10);
        });

        test('Last page is on page 3 and links to page 10', () => {
            const wrapper = factory(3).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(10);
        });

        test('Last page is on page 4 and links to page 10', () => {
            const wrapper = factory(4).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(10);
        });

        test('Last page is on page 5 and links to page 10', () => {
            const wrapper = factory(5).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(10);
        });

        test('Last page is on page 6 and links to page 10', () => {
            const wrapper = factory(6).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(10);
        });

        test('Last page is on page 7 and links to page 10', () => {
            const wrapper = factory(7).find(selector);

            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.$options.name).toBe('BooksPagerNumberBtn');
            expect(wrapper.vm.pageNumber).toBe(10);
        });

        test('Last page is not on page 8', () => {
            expect(factory(8).find(selector).exists()).toBe(false);
        });

        test('Last page is not on page 9', () => {
            expect(factory(9).find(selector).exists()).toBe(false);
        });

        test('Last page is not on page 10', () => {
            expect(factory(10).find(selector).exists()).toBe(false);
        });
    });
});

describe('Next page', () => {
    const selector = '.next';
    describe('10 Page Test', () => {
        describe('Next page on page 1', () => {
            let wrapper;
            beforeAll(() => { wrapper = factory(1).find(selector) });

            test('Included', () => {
                expect(wrapper.exists()).toBe(true);
            });

            test('Disabled', () => {
                expect(wrapper.attributes().disabled).toBeFalsy();
            });

            test('Clicking changes to page 2', () => {
                wrapper.trigger('click');
                expect(changePage).toHaveBeenCalledTimes(1);
                expect(changePage).lastCalledWith(expect.any(Object), { pageNumber: 2 });
            });
        });

        describe('Next page on page 2', () => {
            let wrapper;
            beforeAll(() => { wrapper = factory(2).find(selector) });

            test('Included', () => {
                expect(wrapper.exists()).toBe(true);
            });

            test('Disabled', () => {
                expect(wrapper.attributes().disabled).toBeFalsy();
            });

            test('Clicking changes to page 3', () => {
                wrapper.trigger('click');
                expect(changePage).toHaveBeenCalledTimes(1);
                expect(changePage).lastCalledWith(expect.any(Object), { pageNumber: 3 });
            });
        });

        describe('Next page on page 3', () => {
            let wrapper;
            beforeAll(() => { wrapper = factory(3).find(selector) });

            test('Included', () => {
                expect(wrapper.exists()).toBe(true);
            });

            test('Disabled', () => {
                expect(wrapper.attributes().disabled).toBeFalsy();
            });

            test('Clicking changes to page 4', () => {
                wrapper.trigger('click');
                expect(changePage).toHaveBeenCalledTimes(1);
                expect(changePage).lastCalledWith(expect.any(Object), { pageNumber: 4 });
            });
        });

        describe('Next page on page 4', () => {
            let wrapper;
            beforeAll(() => { wrapper = factory(4).find(selector) });

            test('Included', () => {
                expect(wrapper.exists()).toBe(true);
            });

            test('Disabled', () => {
                expect(wrapper.attributes().disabled).toBeFalsy();
            });

            test('Clicking changes to page 5', () => {
                wrapper.trigger('click');
                expect(changePage).toHaveBeenCalledTimes(1);
                expect(changePage).lastCalledWith(expect.any(Object), { pageNumber: 5 });
            });
        });

        describe('Next page on page 5', () => {
            let wrapper;
            beforeAll(() => { wrapper = factory(5).find(selector) });

            test('Included', () => {
                expect(wrapper.exists()).toBe(true);
            });

            test('Disabled', () => {
                expect(wrapper.attributes().disabled).toBeFalsy();
            });

            test('Clicking changes to page 6', () => {
                wrapper.trigger('click');
                expect(changePage).toHaveBeenCalledTimes(1);
                expect(changePage).lastCalledWith(expect.any(Object), { pageNumber: 6 });
            });
        });

        describe('Next page on page 6', () => {
            let wrapper;
            beforeAll(() => { wrapper = factory(6).find(selector) });

            test('Included', () => {
                expect(wrapper.exists()).toBe(true);
            });

            test('Disabled', () => {
                expect(wrapper.attributes().disabled).toBeFalsy();
            });

            test('Clicking changes to page 7', () => {
                wrapper.trigger('click');
                expect(changePage).toHaveBeenCalledTimes(1);
                expect(changePage).lastCalledWith(expect.any(Object), { pageNumber: 7 });
            });
        });

        describe('Next page on page 7', () => {
            let wrapper;
            beforeAll(() => { wrapper = factory(7).find(selector) });

            test('Included', () => {
                expect(wrapper.exists()).toBe(true);
            });

            test('Disabled', () => {
                expect(wrapper.attributes().disabled).toBeFalsy();
            });

            test('Clicking changes to page 8', () => {
                wrapper.trigger('click');
                expect(changePage).toHaveBeenCalledTimes(1);
                expect(changePage).lastCalledWith(expect.any(Object), { pageNumber: 8 });
            });
        });

        describe('Next page on page 8', () => {
            let wrapper;
            beforeAll(() => { wrapper = factory(8).find(selector) });

            test('Included', () => {
                expect(wrapper.exists()).toBe(true);
            });

            test('Disabled', () => {
                expect(wrapper.attributes().disabled).toBeFalsy();
            });

            test('Clicking changes to page 9', () => {
                wrapper.trigger('click');
                expect(changePage).toHaveBeenCalledTimes(1);
                expect(changePage).lastCalledWith(expect.any(Object), { pageNumber: 9 });
            });
        });

        describe('Next page on page 9', () => {
            let wrapper;
            beforeAll(() => { wrapper = factory(9).find(selector) });

            test('Included', () => {
                expect(wrapper.exists()).toBe(true);
            });

            test('Disabled', () => {
                expect(wrapper.attributes().disabled).toBeFalsy();
            });

            test('Clicking changes to page 10', () => {
                wrapper.trigger('click');
                expect(changePage).toHaveBeenCalledTimes(1);
                expect(changePage).lastCalledWith(expect.any(Object), { pageNumber: 10 });

            });
        });

        describe('Next page on page 10', () => {
            let wrapper;
            beforeAll(() => { wrapper = factory(10).find(selector) });

            test('Included', () => {
                expect(wrapper.exists()).toBe(true);
            });

            test('Disabled', () => {
                expect(wrapper.attributes().disabled).toBeTruthy();
            });

            test('Clicking does nothing', () => {
                wrapper.trigger('click');
                expect(changePage).not.toHaveBeenCalled();
            });
        });
    });
});