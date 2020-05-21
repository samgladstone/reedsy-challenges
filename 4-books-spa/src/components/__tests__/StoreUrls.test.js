import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
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
        "stores": {
            "Amazon": "https://www.Amazon.co.uk/Book-Thief-Markus-Zusak/dp/0552773891",
            "Apple Books": "https://books.apple.com/gb/book/the-book-theif/id1078821147",
            "Play Store": "https://play.google.com/store/audiobooks/details/Markus_Zusak_The_Book_Thief?id=AQAAAEDgxmqGmM&hl=en"
        }
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
    return shallowMount(StoreUrls, {
        store, localVue,
        propsData
    });
}

test('The correct book is looked up', () => {
    const book2 = store.state.books[2] = { ...mockBook, id: 2 };

    expect(factory().vm.book).toBe(mockBook);
    expect(factory({ bookId: 2 }).vm.book).toBe(book2);
});

describe('Link rendering', () => {
    test('No stores', () => {
        delete store.state.books[1].stores;
        expect(factory()).toMatchSnapshot();
    });

    test('Empty stores', () => {
        store.state.books[1].stores = {};
        expect(factory()).toMatchSnapshot();
    });

    test('One store', () => {
        const stores = store.state.books[1].stores;
        delete stores.Amazon;
        delete stores['Play Store'];
        expect(factory()).toMatchSnapshot();
    });

    test('All three stores', () => {
        expect(factory()).toMatchSnapshot();
    });
});