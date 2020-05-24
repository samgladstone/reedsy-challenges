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

const factory = (propsData = { bookId: 1 }, showSynopsis) => {
    const wrapper = shallowMount(BookRow, { store, localVue, propsData });

    if (showSynopsis === !!showSynopsis)
        wrapper.setData({ showSynopsis });

    return wrapper;
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

describe('Synopsis', () => {
    test('Is not shown to with default settings', () => {
        expect(factory().find('.synopsis').exists()).toBe(false);
    });

    test('Is not shown if $data.showSynopsis is true', async () => {
        const wrapper = factory(undefined, true);
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.synopsis').exists()).toBe(true);
    });

    test('Is shown if $data.showSynopsis is false', async () => {
        const wrapper = factory(undefined, false);
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.synopsis').exists()).toBe(false);
    });

    describe('Clicking the row changes $data.showSynopsis', () => {
        test('showSynopsis starts as true', () => {
            const wrapper = factory(undefined, true);
            wrapper.trigger('click');
            expect(wrapper.vm.$data.showSynopsis).toBe(false);
        });

        test('showSynopsis starts as false', () => {
            const wrapper = factory(undefined, false);
            wrapper.trigger('click');
            expect(wrapper.vm.$data.showSynopsis).toBe(true);
        });

        describe('.synopsis text', () => {
            let store, mockBook;
            const factory = (synopsis, title) => {
                mockBook = {
                    "id": 1,
                    "author": "Markus Zusak",
                    "cover": "11.jpg",
                    "rating": "9.9",
                    "published": "2005",
                    "slug": "the-book-theif",
                    synopsis,
                    title,
                };

                store = new Vuex.Store({
                    state: {
                        books: {
                            1: mockBook
                        }
                    }
                })

                const wrapper = shallowMount(BookRow, { store, localVue, propsData: { bookId: 1 } });

                return wrapper;
            };

            test("Uses the book's synopsis", () => {
                const wrapper = factory('Hello There', 'Book');
                expect(wrapper.vm.synopsis).toBe('Hello There');
            });

            test('New lines are converted to line breaks', () => {
                const wrapper = factory('Hello\nThere', 'Book');
                expect(wrapper.vm.synopsis).toBe('Hello<br><br>There');
            });

            test('The books title is bolded', () => {
                const wrapper = factory('Hello There Book', 'Book');
                expect(wrapper.vm.synopsis).toBe('Hello There <b>Book</b>');
            });
        });
    });

    describe('.rowTitle', () => {
        test('When synopsis is shown', () => {
            const wrapper = factory(undefined, true);
            expect(wrapper.vm.rowTitle).toBe(`Hide the synopsis for ${mockBook.title}.`);
        });

        test('When synopsis is hidden', () => {
            const wrapper = factory(undefined, false);
            expect(wrapper.vm.rowTitle).toBe(`Show the synopsis for ${mockBook.title}.`);
        });
    });
})