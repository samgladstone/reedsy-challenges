<template>
    <div>
        <a v-for="(url, store) in book.stores"
           :key="store"
           :href="url">{{store}}</a>
        <span>Not Available</span>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: 'StoreUrls',
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
    a {
        display: inline;
        color: #c0d58c;
        text-decoration: none;
        font-weight: 600;
        white-space: nowrap;

        &:not(:last-child) {
            padding-right: 1em;
        }
    }

    @media (min-width: $urlsBreakpoint) {
        a:not(:last-child) {
            display: block;
            padding-right: 0;
        }
    }

    span {
        font-style: italic;
        color: #aaa;
        display: none;

        &:first-child {
            display: block;
        }
    }
</style>