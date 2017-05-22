<template>
    <div class="cartcontrol">
        <div class="minus-wrapper" @click.stop.prevent="minus">
            <transition name="move">
                <icon name="minus-circle" class="minus" v-show="food.count > 0" ></icon>
            </transition>
        </div>
        <div class="count" v-show="food.count > 0">{{food.count}}</div>
        <div class="plus-wrapper" @click.stop.prevent="plus">
            <icon name="plus-circle" class="plus" ></icon>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';

    export default {
        props: {
            food: {
                type: Object
            }
        },

        methods: {
            plus(event) {
                if (!this.food.count) {
                    Vue.set(this.food, 'count', 1);
                } else {
                    this.food.count++;
                }

                // this.$dispatch('cart.plus', event.target);
            },

            minus() {
                if (this.food.count) {
                    this.food.count--;
                }
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
.cartcontrol
    font-size: 0
    .minus-wrapper
        display: inline-block
        .minus
            font-size: 24px
            color: rgb(0, 160, 220)
            line-height: 24px
            padding: 4px
            transition: all .4s linear
            transform: rotate(180deg)
            &.move-enter-active
                opacity: 0
                transform: translate3d(0, 0, 0)
            &.move-enter, &.move-leave-active
                opacity: 1
                transform: translate3d(24px, 0, 0)
    .plus-wrapper
        display: inline-block
        .plus
            font-size: 24px
            color: rgb(0, 160, 220)
            line-height: 24px
            padding: 4px
    .count
        display: inline-block
        margin: 0 10px
        font-size: 10px
        color: rgb(147, 153, 159)
        line-height: 24px
        vertical-align: top
        text-align: center
</style>
