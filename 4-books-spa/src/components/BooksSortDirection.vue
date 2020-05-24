<template>
    <button type="button"
            @click="changeDirection"
            :title="`Click to change to ${sortAsc ? 'descending': 'ascending'} order`"
            class="direction">
        <img :src="require(`@/images/${sortAsc ? 'arrow-down' : 'arrow-up' }.svg`)"
             :alt="`Sorted in ${sortAsc ? 'ascending' : 'descending'} order`" />
    </button>
</template>

<script>
    import { mapMutations, mapState } from 'vuex';

    export default {
        name: 'BookSortDiretion',
        computed: {
            ...mapState(['sortAsc']),
        },
        methods: {
            changeDirection() {
                this.changeSort({ sortAsc: !this.sortAsc });
            },
            ...mapMutations(['changeSort']),
        },
    };
</script>