<template>
    <div class="book-sort"
         :class="{show: show || lockShowBound}"
         @mouseover="show = true"
         @mouseleave="show = false">
        <button type="button"
                @click="lockShowBound = !lockShowBound"
                title="Sort Books">
            <img src="@/images/sort.svg"
                 alt="Sort Books" />
        </button>
        <div v-if="show || lockShowBound"
             class="sort-options">
            <i class="sort-options-arrow"></i>
            <BooksSortBy></BooksSortBy>
            <BooksSortDirection></BooksSortDirection>
        </div>
    </div>
</template>
<script>
    import BooksSortBy from './BooksSortBy';
    import BooksSortDirection from './BooksSortDirection';

    export default {
        name: 'BookSort',
        components: {
            BooksSortBy,
            BooksSortDirection,
        },
        data: () => ({ show: false, lockShow: false }),
        computed: {
            lockShowBound: {
                get() {
                    return this.lockShow;
                },
                set(shouldLockShow) {
                    this.lockShow = shouldLockShow;

                    document[
                        shouldLockShow ? 'addEventListener' : 'removeEventListener'
                    ]('click', this.hideFromOutsideClick);
                },
            },
        },
        methods: {
            hideFromOutsideClick(event) {
                if (!this.$el.contains(event.target)) this.lockShowBound = false;
            },
        },
    };
</script>
<style lang="scss" scoped>
    $borderColor: #e3e3e3;

    .book-sort {
        position: absolute;
        top: -3em;
        right: 0.25em;

        .sort-options {
            display: none;
            position: absolute;
            top: 1.75em;
            right: 0;
            background-color: white;
            border: 1px solid $borderColor;
            padding: 0.5em;
            border-radius: 0.5em;
            margin-top: 9px;

            .sort-options-arrow {
                width: 0;
                height: 0;
                border: 9px solid transparent;
                border-top: 0;
                border-bottom-color: $borderColor;
                position: absolute;
                top: -9px;
                right: 0.75em;
            }
        }

        &.show {
            button:not(.direction) {
                background-color: #e3e3e3;
            }
            .sort-options {
                display: flex;
            }
        }

        button {
            border: 0;
            background: none;
            cursor: pointer;
            border-radius: 0.25em;

            &:first-child img {
                height: 1.75em;
            }
        }
    }

    @media (min-width: $urlsBreakpoint) {
        .book-sort {
            top: 0;
        }
    }
</style>