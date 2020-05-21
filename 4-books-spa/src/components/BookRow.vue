<template>
    <tbody>
        <tr>
            <td class="details">
                <BookDetails :book-id="bookId"></BookDetails>
            </td>
            <td class="published">{{book.published}}</td>
            <td class="rating">{{book.rating}}/10</td>
            <td class="store-urls">
                <StoreUrls :book-id="bookId"></StoreUrls>
            </td>
        </tr>
    </tbody>
</template>

<script>
    import { mapState } from 'vuex';
    import BookDetails from './BookDetails';
    import StoreUrls from './StoreUrls';

    export default {
        name: 'BookRow',
        components: {
            BookDetails,
            StoreUrls,
        },
        props: {
            bookId: {
                type: Number,
                required: true,
            },
        },
        computed: {
            ...mapState({
                book(state) {
                    return state.books[this.bookId];
                },
            }),
        },
    };
</script>

<style lang="scss" scoped>
    tbody {
        &:nth-child(even) {
            background-color: #faf9f7;
        }

        & tr td {
            padding: $tablePadding;
            vertical-align: top;
            text-align: center;

            &:first-child {
                vertical-align: top;
                text-align: left;
                padding-left: $tablePadding;
            }

            &:last-child {
                padding-right: $tablePadding;

                & a {
                    display: block;
                    color: #c0d58c;
                    text-decoration: none;
                    font-weight: 600;
                }
            }
        }
    }

    tbody tr {
        & td.store-urls,
        td.published {
            display: none;
        }
    }
    @media (min-width: 580px) {
        tbody tr td:not(:first-child) {
            vertical-align: middle;
        }
    }

    @media (min-width: $urlsBreakpoint) {
        tbody tr td:not(:first-child).store-urls {
            display: table-cell;
        }
    }

    @media (min-width: $publishedBreakpoint) {
        tbody tr td.published {
            display: table-cell;
        }
    }
</style>