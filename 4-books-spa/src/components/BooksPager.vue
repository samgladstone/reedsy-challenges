<template>
    <div class="pager-wrapper">
        <div>
            <button type="button"
                    @click="change(pageNumber - 1)"
                    class="prev"
                    :disabled="is1"
                    :title="is1 ? '':'Go to previous page'">
                <img src="@/images/previous.svg"
                     alt="Previous Page" />
            </button>
            <BooksPagerNumberBtn v-if="pageNumber > 3"
                                 :page-number="1"
                                 class="first"></BooksPagerNumberBtn>
            <span v-if="pageNumber > 4">...</span>
            <BooksPagerNumberBtn v-if="pageNumber > 2"
                                 :page-number="pageNumber - 2"
                                 class="pn-minus-2"></BooksPagerNumberBtn>
            <BooksPagerNumberBtn v-if="pageNumber > 1"
                                 :page-number="pageNumber - 1"
                                 class="pn-minus-1"></BooksPagerNumberBtn>
            <BooksPagerNumberBtn :page-number="pageNumber"
                                 disabled
                                 class="current-page"></BooksPagerNumberBtn>
            <BooksPagerNumberBtn v-if="pagesUntilEnd > 0"
                                 :page-number="pageNumber + 1"
                                 class="pn-plus-1"></BooksPagerNumberBtn>
            <BooksPagerNumberBtn v-if="pagesUntilEnd > 1"
                                 :page-number="pageNumber + 2"
                                 class="pn-plus-2"></BooksPagerNumberBtn>
            <span v-if="pagesUntilEnd > 3">...</span>
            <BooksPagerNumberBtn v-if="pagesUntilEnd > 2"
                                 :page-number="pagesTotal"
                                 class="last"></BooksPagerNumberBtn>
            <button type="button"
                    @click="change(pageNumber + 1)"
                    :disabled="isLast"
                    :title="isLast ? '':'Go to next page'"
                    class="next">
                <img src="@/images/next.svg"
                     alt="Next page" />
            </button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapMutations, mapState } from 'vuex';
    import BooksPagerNumberBtn from './BooksPagerNumberBtn';

    export default {
        name: 'BooksPager',
        components: {
            BooksPagerNumberBtn,
        },
        computed: {
            is1() {
                return this.pageNumber === 1;
            },
            isLast() {
                return this.pageNumber === this.pagesTotal;
            },
            pagesUntilEnd() {
                return this.pagesTotal - this.pageNumber;
            },
            ...mapState(['pageNumber']),
            ...mapGetters(['pagesTotal']),
        },
        methods: {
            change(newPage) {
                this.changePage({ pageNumber: newPage });
            },
            ...mapMutations(['changePage']),
        },
    };
</script>

<style lang="scss" scoped>
    .pager-wrapper {
        width: 100%;
        display: flex;
        justify-content: space-around;
        margin: 2em 0 1em 0;

        div {
            display: flex;

            button {
                border: 0;
                background-color: transparent;
                cursor: pointer;
                font-size: 1.25em;
                height: 1.5em;
                padding: 0;

                &:disabled {
                    cursor: unset;
                    opacity: 0.4;
                    color: black;
                }

                img {
                    font-size: 1em;
                    height: 1.25em;
                    margin: 0.1em 0;
                }

                &.pn {
                    padding: 0 0.25em;
                }

                &.current-page {
                    opacity: 1 !important;
                    font-weight: 600;
                    text-decoration: underline;
                }
            }

            span {
                padding-top: 0.25em;
            }
        }
    }
</style>