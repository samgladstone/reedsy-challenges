<template>
    <div id="container">
        <h1>Most popular Books of All time</h1>
        <table>
            <thead>
                <th>Title</th>
                <th class="published">Published</th>
                <th>Rating</th>
                <th class="store-urls">Buy On</th>
            </thead>
            <BookRow v-for="book in books"
                     :key="book.id"
                     :book-id="book.id">
            </BookRow>
        </table>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import BookRow from './components/BookRow';

    export default {
        name: 'App',
        components: { BookRow },
        computed: {
            ...mapGetters({
                books: 'booksSorted',
            }),
        },
    };
</script>

<style lang="scss" scoped>
    #container {
        background-color: white;
        min-height: 90vh;
        margin: 0 auto;
        padding: 1em;
        border-radius: 0.5em;

        & h1 {
            margin: 0 0 1em 0;
            font-weight: 600;
            font-size: 1.4em;
        }
    }

    table {
        width: 100%;
        border-collapse: collapse;

        & thead {
            text-transform: uppercase;
            color: #aaa;
            text-align: center;

            & th {
                font-weight: 600;
                padding-bottom: $tablePadding + 0.4em;
                padding-right: $tablePadding;

                &:first-child {
                    text-align: left;
                    padding-left: $tablePadding;
                }
            }
        }
    }

    thead {
        & th.store-urls,
        th.published {
            display: none;
        }
    }

    @media (min-width: $urlsBreakpoint) {
        thead th.store-urls {
            display: table-cell;
        }
    }

    @media (min-width: $publishedBreakpoint) {
        thead th.published {
            display: table-cell;
        }
        #container {
            max-width: min(80vw, 1400px);
        }
    }
</style>
