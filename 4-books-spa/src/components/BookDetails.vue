<template>
    <div class="book-details">
        <div class="image-wrapper">
            <img :src="coverImage"
                 :alt="`Cover for ${book.title}`" />
        </div>
        <div class="text">
            <div>
                <h2>{{book.title}}</h2>
                <span>{{book.author}}</span>
                <span class="published"> ({{book.published}})</span>
            </div>
            <div class="store-urls">
                <span>Buy: </span>
                <StoreUrls :book-id="bookId"></StoreUrls>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import StoreUrls from './StoreUrls';

    export default {
        name: 'BookDetails',
        components: {
            StoreUrls,
        },
        props: {
            bookId: {
                type: Number,
                required: true,
            },
        },
        computed: {
            coverImage() {
                return require(`@/images/${this.book.cover}`);
            },
            coverImageDimensions() {
                return this.coverImage.height;
            },
            ...mapState({
                book(state) {
                    return state.books[this.bookId];
                },
            }),
        },
    };
</script>

<style lang="scss" scoped>
    .book-details {
        display: flex;

        .image-wrapper {
            width: 4.7 * $tablePadding;
            height: 7 * $tablePadding;
            margin-right: $tablePadding;
            overflow: hidden;

            img {
                max-width: 100%;
                max-height: 100%;
                border-radius: 0.5em;
                margin: auto;
            }
        }

        & .text {
            position: relative;

            & div:not(.store-urls) {
                display: block;

                & h2 {
                    font-size: $tablePadding;
                    font-weight: 700;
                    margin: 0.1 * $tablePadding 0 0.333 * $tablePadding 0;
                }

                & span {
                    color: #a5a5a5;
                }
            }

            & div.store-urls {
                position: absolute;
                display: flex;
                bottom: 0;

                & span {
                    padding-right: 0.5em;
                }
            }
        }
    }

    @media (min-width: $urlsBreakpoint) {
        .book-details .text div.store-urls {
            display: none;
        }
    }

    @media (min-width: $publishedBreakpoint) {
        .published {
            display: none;
        }
    }
</style>