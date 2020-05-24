import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import BooksPagerNumberBtn from '../BooksPagerNumberBtn.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

let changePage;

const factory = (pageNumber = 1) => {
    changePage = jest.fn();

    return shallowMount(BooksPagerNumberBtn, {
        localVue, propsData: { pageNumber }, store: new Vuex.Store({ mutations: { changePage } })
    })
}

test('Displays the set page', async () => {
    const wrapper = factory();
    const tests = [1, 5, 100];

    while (tests.length) {
        const n = tests.pop();
        wrapper.setProps({ pageNumber: n })
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toBe('' + n);
    }
});

test('Clicking the button updates the page', () => {
    const wrapper = factory();

    [1, 5, 100].forEach((n, index) => {
        wrapper.setProps(n);
        wrapper.trigger('click');
        expect(changePage).toBeCalledTimes(index + 1);
        expect(changePage).lastCalledWith(expect.any(Object), { pageNumber: 1 });

    });
});