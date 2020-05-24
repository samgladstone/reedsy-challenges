<template>
    <button :key="pageNumber"
            type="button"
            @click="changePage({ pageNumber })"
            class="pn">{{pageNumber}}</button>
</template>
<script>
    import { mapMutations } from 'vuex';
    export default {
        name: 'BooksPagerNumberBtn',
        props: {
            pageNumber: {
                type: Number,
                required: true,
            },
        },
        methods: {
            ...mapMutations(['changePage']),
        },
    };
</script>