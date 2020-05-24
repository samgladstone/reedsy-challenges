<template>
    <div id="sort-books-by-wrapper">
        <label for="sort-books-by">Sort By</label>
        <select id="sort-books-by"
                v-model="sortByBound">
            <option v-for="(name, value) in options"
                    :key="value"
                    :value="value">{{name}}</option>

        </select>
    </div>
</template>

<script>
    import { BOOK_SORTS } from '../constants';
    import { mapMutations, mapState } from 'vuex';

    export default {
        name: 'BookSortDiretion',
        data: () => ({
            options: BOOK_SORTS,
        }),
        computed: {
            sortByBound: {
                get() {
                    return this.sortBy;
                },
                set(sortBy) {
                    this.changeSort({ sortBy });
                },
            },
            ...mapState(['sortBy']),
        },
        methods: {
            ...mapMutations(['changeSort']),
        },
    };
</script>

<style lang="scss" scoped>
    #sort-books-by-wrapper {
        display: flex;

        label {
            white-space: nowrap;
            padding-right: 0.75em;
        }
        select {
            border-radius: 0.25em;
            padding: 0.25em;
        }
    }
</style>