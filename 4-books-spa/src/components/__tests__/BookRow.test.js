import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import BookDetails from '../BookDetails.vue';
import BookRow from '../BookRow.vue';
import StoreUrls from '../StoreUrls.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

let store, mockBook;

beforeEach(() => {
    mockBook = {
        "id": 1,
        "author": "Markus Zusak",
        "cover": "11.jpg",
        "rating": "9.9",
        "published": "2005",
        "slug": "the-book-theif",
        "synopsis": "1939. Nazi Germany. The country is holding its breath. Death has never been busier. Liesel, a nine-year-old girl, is living with a foster family on Himmel Street. Her parents have been taken away to a concentration camp. Liesel steals books. This is her story and the story of the inhabitants of her street when the bombs begin to fall.",
        "title": "The Book Thief",
    };

    store = new Vuex.Store({
        state: {
            books: {
                1: mockBook
            }
        }
    })
})

const factory = (propsData = { bookId: 1 }) => {
    return shallowMount(BookRow, {
        store, localVue,
        propsData
    });
}

test('The correct book is looked up', () => {
    const book2 = store.state.books[2] = { ...mockBook, id: 2 };

    expect(factory().vm.book).toBe(mockBook);
    expect(factory({ bookId: 2 }).vm.book).toBe(book2);
});

describe('Correct rendering', () => {
    test('BookDetails has the correct id passed', () => {
        const wrapper = factory().findComponent(BookDetails);
        expect(wrapper.vm.bookId).toBe(mockBook.id);
    });

    test('Published', () => {
        expect(factory().find('.published').text()).toBe(mockBook.published);
    });

    test('Rating', () => {
        expect(factory().find('.rating').text()).toBe(`${mockBook.rating}/10`);
    });

    test('Store Urls has the correct id passed', () => {
        const wrapper = factory().findComponent(StoreUrls);
        expect(wrapper.vm.bookId).toBe(mockBook.id);
    });
});