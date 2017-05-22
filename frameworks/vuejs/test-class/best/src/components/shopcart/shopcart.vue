<template>
    <div class="shopcart">
        <div class="content" @click="toggleList">
            <div class="content-left">
                <div class="logo-wrapper">
                    <div class="logo" :class="{'highlight': totalCount > 0}">
                        <icon name="shopping-cart" class="icon" :class="{'highlight': totalCount > 0}"></icon>
                    </div>
                    <div class="count" v-show="totalCount > 0">{{totalCount}}</div>
                </div>
                <span class="total-price" :class="{'highlight': totalPrice > 0}">￥{{totalPrice}}</span>
                <span class="desc">另需配送费￥{{deliveryPrice}}元</span>
            </div>
            <div class="content-right" @click.stop.prevent="pay">\
                <div class="pay" :class="payClass">
                    {{payDesc}}
                </div>
            </div>
        </div>
        <div class="ball-container">
            <div class="ball" v-for="ball in balls" v-show="ball.show">
                <div class="inner inner-hook"></div>
            </div>
        </div>
        <div class="shopcart-list" v-show="listShow">
            <div class="list-header">
                <h1 class="title">购物车</h1>
                <span class="empty" @click="empty">清空</span>
            </div>
            <div class="list-content" ref="listContent">
                <ul>
                    <li class="food" v-for="food in selectFoods">
                        <span class="name">{{food.name}}</span>
                        <div class="price">
                            <span>￥{{food.price * food.count}}</span>
                        </div>
                        <div class="cartcontrol-wrapper">
                            <carcontrol :food="food"></carcontrol>
                        </div>
                    </li>
                </ul> 
            </div>
        </div>
        <div class="list-mask" @click="hideList" v-show="listShow"></div>
    </div>
</template>

<script>
    import BScroll from 'better-scroll';
    import cartcontrol from '../cartcontrol/cartcontrol';

    export default {
        props: {
            selectFoods: {
                type: Array,
                default() {
                    return [{
                        price: 10,
                        count: 1
                    }];
                }
            },

            deliveryPrice: {
                type: Number,
                default: 0
            },

            minPrice: {
                type: Number,
                default: 0
            }
        },

        data() {
            return {
                balls: [
                    { show: false },
                    { show: false },
                    { show: false },
                    { show: false },
                    { show: false }
                ],

                dropBalls: [],
                fold: true
            };
        },

        computed: {
            totalPrice() {
                let total = 0;
                this.selectFoods.forEach((food) => {
                    total += food.price * food.count;
                });

                return total;
            },

            totalCount() {
                let count = 0;

                this.selectFoods.forEach((food) => {
                    count += food.count;
                });

                return count;
            },

            payDesc() {
                if (this.totalPrice === 0) {
                    return `￥${this.minPrice}元起送`;
                } else if (this.totalPrice < this.minPrice) {
                    let diff = this.minPrice - this.totalPrice;
                    return `还差￥${diff}元起送`;
                } else {
                    return '去结算';
                }
            },

            payClass() {
                return this.totalPrice < this.minPrice ? 'not-enough' : 'enough';
            },

            listShow() {
                if (!this.totalCount) {
                    this.fold = true;
                    return false;
                }

                let show = !this.fold;
                if (show) {
                    this.$nextTick(() => {
                        if (!this.scroll) {
                            this.scroll = new BScroll(this.$refs.listContent, {
                                click: true
                            });
                        } else {
                            this.scroll.refresh();
                        }
                    });
                }

                return show;
            }
        },

        methods: {
            drop(el) {
                for (let i = 0; i < this.balls.length; i++) {
                    let ball = this.balls[i];
                    if (!ball.show) {
                        ball.show = true;
                        ball.el = el;
                        this.dropBalls.push(ball);
                        return;
                    }
                }
            },

            toggleList() {
                if (!this.totalCount) { return; }

                this.fold = !this.fold;
            },

            hideList() {
                this.fold = true;
            },

            empty() {
                this.selectFoods.forEach((food) => {
                    food.count = 0;
                });

                window.alert(`支付￥{this.totalPrice}元`);
            }
        },

        transitions: {

        },

        components: {
            cartcontrol
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
.shopcart
    position: fixed 
    left: 0
    bottom: 0
    height: 46px
    width: 100%
    background: #141d27
    z-index: 50
    .content
        display: flex
        background: #141d27
        font-size: 0
        color: rgba(255, 255, 255, 0.4)
        .content-left
            flex: 1
            .logo-wrapper
                display: inline-block
                vertical-align: top
                position: relative
                top: -10px
                margin: 0 12px
                padding: 6px
                width: 56px
                height: 56px
                box-sizing: border-box
                border-radius: 50%
                background: #141d27
                .logo
                    width: 100%
                    height: 100%
                    border-radius: 50%
                    text-align: center
                    background: #2b343c
                    &.highlight
                        color: rgb(255, 255, 255)
                        background: rgb(0, 160, 220)
                    .icon
                        margin-top: 13px
                        transform: scale(2)
                .count
                    position: absolute
                    top: 0
                    right: 0
                    width: 24px
                    font-size: 9px
                    font-weight: 700
                    color: rgb(255, 255, 255)
                    line-height: 16px
                    text-align: center
                    background: rgb(240, 20, 20)
                    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.4)
                    border-radius: 6px
            .total-price
                display: inline-block
                margin: 11px 12px 12px 0
                padding-right: 12px
                color: rgba(255, 255, 255, 0.4)
                font-weight: 700
                line-height: 24px
                font-size: 16px
                border-right: 1px solid rgba(255, 255, 255, 0.1)
            .desc
                display: inline-block
                margin: 0 12px
                font-size: 16px
                color: rgba(255, 255, 255, 0.4)
                font-weight: 700
                line-height: 24px
        .content-right
            position: absolute
            right: 0
            top: 0
            width: 105px
            height: 100%
            background-color: rgba(0, 0, 0, 0.2)
            font-size: 12px
            color: rgba(255, 255, 255, 0.4)
            font-weight: 700
            line-height: 24px
            padding: 11px 8px
            text-align: center
                
                
        
</style>
