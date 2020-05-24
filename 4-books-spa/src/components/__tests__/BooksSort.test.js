import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import BooksSort from '../BooksSort.vue';
import BooksSortBy from '../BooksSortBy';
import BooksSortDirection from '../BooksSortDirection';

const localVue = createLocalVue();
localVue.use(Vuex);

const factory = ({ show = false, lockShow = false }) => shallowMount(BooksSort, { localVue, data: () => ({ show, lockShow }) });

describe("Setting the display for the sort options", () => {
    describe('Hovering: set .show', () => {
        test('Set to true on hover', async () => {
            const wrapper = factory({ show: false });
            wrapper.trigger('mouseover');
            expect(wrapper.vm.$data.show).toBe(true);
        });

        test('Set to true on end of hover', async () => {
            const wrapper = factory({ show: true });
            wrapper.trigger('mouseleave');
            expect(wrapper.vm.$data.show).toBe(false);
        });
    });

    describe('Clicking: set .lockShow', () => {
        test('Set to true on when false', async () => {
            const wrapper = factory({ lockShow: false });
            wrapper.find('button').trigger('click');
            expect(wrapper.vm.$data.lockShow).toBe(true);
        });

        test('Set to false on when true', async () => {
            const wrapper = factory({ lockShow: true });
            wrapper.find('button').trigger('click');
            expect(wrapper.vm.$data.lockShow).toBe(false);
        });

        describe('Uses an event listener that closes the popup when the rest of the document is clicked', () => {
            test('Adds the event listener when the lockShow is set to true', () => {
                const spy = jest.spyOn(document, 'addEventListener');
                const wrapper = factory({ lockShow: false });
                wrapper.find('button').trigger('click');

                expect(spy).toBeCalledTimes(1);
                expect(spy).lastCalledWith('click', wrapper.vm.hideFromOutsideClick);
                spy.mockRestore();
            });

            test('Removes the event listener when the lockShow is set to false', () => {
                const spy = jest.spyOn(document, 'removeEventListener');
                const wrapper = factory({ lockShow: true });
                wrapper.find('button').trigger('click');

                expect(spy).toBeCalledTimes(1);
                expect(spy).lastCalledWith('click', wrapper.vm.hideFromOutsideClick);
                spy.mockRestore();
            });

            describe('hideFromOutsideClick', () => {
                test('Clicking inside the element does nothing', () => {
                    const wrapper = factory({ lockShow: true });
                    const hide = wrapper.vm.hideFromOutsideClick;
                    const data = wrapper.vm.$data;

                    const { wrappers } = wrapper.findAll('*');

                    expect.assertions(wrappers.length);
                    wrappers.forEach(w => {
                        if (w.element) {
                            hide({ target: w.element });
                            expect(data.lockShow).toBe(true);
                        }
                    });
                });

                describe('Clicking outside the element', () => {
                    test('Sets .lockShow to false', () => {
                        const wrapper = factory({ lockShow: true });
                        wrapper.vm.hideFromOutsideClick({
                            target: document.body.appendChild(document.createElement('div'))
                        });
                        expect(wrapper.vm.$data.lockShow).toBe(false);
                    });

                    test('Clears the event listener', () => {
                        const spy = jest.spyOn(document, 'removeEventListener');
                        const wrapper = factory({ lockShow: true });
                        wrapper.vm.hideFromOutsideClick({
                            target: document.body.appendChild(document.createElement('div'))
                        });

                        expect(spy).toBeCalledTimes(1);
                        expect(spy).lastCalledWith('click', wrapper.vm.hideFromOutsideClick);
                        spy.mockRestore();
                    });
                });
            })
        });
    });
});

describe('Displaying the sort options', () => {
    const selector = '.sort-options';

    test('Hidden when show & lockShow are false', () => {
        expect(factory({ show: false, lockShow: false }).find(selector).exists()).toBe(false);
    });

    test('Show when show is true & lockShow is false', () => {
        expect(factory({ show: true, lockShow: false }).find(selector).exists()).toBe(true);
    });

    test('Show when show is false & lockShow is true', () => {
        expect(factory({ show: false, lockShow: true }).find(selector).exists()).toBe(true);
    });

    test('Show when show & lockShow are true', () => {
        expect(factory({ show: true, lockShow: true }).find(selector).exists()).toBe(true);
    });

    test('Contains a SortBy', () => {
        expect(factory({ show: true }).findComponent(BooksSortBy).exists()).toBe(true);
    });

    test('Contains a SortDirection', () => {
        expect(factory({ show: true }).findComponent(BooksSortDirection).exists()).toBe(true);
    });
});