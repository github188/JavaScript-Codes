<template>
    <div class="goods">
        <div class="menu-wrapper" ref="menuWrapper">
            <ul>
                <li v-for="(item, index) in goods" class="menu-item" :class="{'current': currIndex===index}" @click="selectMenu(index, $event)" >
                    <span class="text">
                        <span v-show="item.type > 0" :class="classMap[item.type]" class="icon"></span>{{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <div class="food-wrapper" ref="foodsWrapper">
            <ul>
                <li v-for="item in goods" class="food-list food-list-hook">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <li v-for="food in item.foods" class="food-item border-1px">
                            <div class="icon">
                                <img width="57" height="57" :src="food.icon">
                            </div>
                            <div class="content">
                                <h2 class="name">{{food.name}}</h2>
                                <span class="desc">{{food.description}}</span>
                                <div>
                                    <span class="count">月售{{food.sellCount}}份</span>
                                    <span class="ratings">好评率{{food.rating}}%</span>
                                </div>
                                <div class="price">
                                    <span class="new-price">￥{{food.price}}</span>
                                    <span v-show="food.oldPrice" class="old-price">￥{{food.oldPrice}}</span>
                                </div>
                            </div>
                            <div class="cartcontrol-wrapper">
                                <cartcontrol :food="food"></cartcontrol>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
        <food :food="selectedFood" ref="food"></food>
    </div>
</template>

<script>
import BScroll from 'better-scroll';
import cartcontrol from '../cartcontrol/cartcontrol';
import shopcart from '../shopcart/shopcart';

export default {
    data() {
        return {
            goods: [],
            listHeight: [],
            scrollY: 0,
            selectedFood: {}
        };
    },

    computed: {
        currIndex() {
            for (let i = 0; i < this.listHeight.length; i++) {
                let h1 = this.listHeight[i];
                let h2 = this.listHeight[i + 1];
                if (!h2 || (this.scrollY >= h1 && this.scrollY < h2)) {
                    return i;
                }
            }

            return 0;
        },

        selectFoods() {
            let foods = [];
            this.goods.forEach((good) => {
                good.foods.forEach((food) => {
                    if (food.count) { foods.push(food); }
                });
            });

            return foods;
        }
    },

    methods: {
        selectMenu(index, e) {
            let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
            let el = foodList[index];
            this.foodsScroll.scrollToElement(el, 300);
        },

        selectFood(food, event) {
            this.selectedFood = food;
            this.$refs.food.show();
        },

        _initScroll() {
            this.menuScroll = new BScroll(this.$refs.menuWrapper, {
                click: true
            });

            this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
                click: true,
                probeType: 3
            });

            this.foodsScroll.on('scroll', (pos) => {
                this.scrollY = Math.abs(Math.round(pos.y));
            });
        },

        _calculateHeight() {
            let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
            let height = 0;
            this.listHeight.push(height);
            for (let i = 0; i < foodList.length; i++) {
                let item = foodList[i];
                height += item.clientHeight;
                this.listHeight.push(height);
            }
        }
    },

    created() {
        this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];

        this.$http.get('/api/goods').then((response) => {
            let _res = response.body;
            if (_res.errno === 0) {
                this.goods = [].slice.call(_res.data, 0);
                this.$nextTick(() => {
                    this._initScroll();
                    this._calculateHeight();
                });
            }
        });
    },

    components: {
        cartcontrol,
        shopcart
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">   

@import '../../common/stylus/mixin.styl'

.goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
        flex: 0 0 80px
        width: 80px
        background: #f3f5f7
        .menu-item
            display: table
            width: 56px
            height: 54px
            padding: 0 12px
            font-size: 12px
            line-height: 14px
            &.current
                position: relative
                z-index: 10
                margin-top: -1px
                background-color: #fff
                font-weight: 200
                .text
                    border-none()
            .icon
                display: inline-block
                margin-bottom: 2px
                margin-right: 2px
                vertical-align: top
                width: 12px
                height: 12px
                background-size: 12px 12px
                background-repeat: no-repeat
                &.decrease
                    bg-img('imgs/decrease_3')
                &.discount
                    bg-img('imgs/discount_3')
                &.guarantee
                    bg-img('imgs/guarantee_3')
                &.invoice
                    bg-img('imgs/invoice_3')
                &.special
                    bg-img('imgs/special_3')
            .text
                display: table-cell
                width: 56px
                vertical-align: middle
                font-size: 12px
                border-1px(rgba(7, 17, 27, 0.1))
    .food-wrapper
        flex: 1
        .food-list
            .title
                height: 26px
                line-height: 26px
                padding-left: 14px
                border-left: 2px solid #d9dde1
                background: #f3f5f7
                font-size: 12px
                color: rgb(147, 153, 159)
            .food-item
                margin: 18px
                padding-bottom: 18px
                border-1px(rgba(7, 17, 27, 0.1))
                &:last-child
                    border-none()
                .icon
                    display: inline-block
                    vertical-align: top
                .content
                    display: inline-block
                    position: relative
                    margin-left: 10px
                    margin-top: 2px
                    .name
                        font-size: 14px
                        color: rgb(7, 17, 27)
                        line-height: 14px
                    .desc, .count, .ratings
                        display: inline-block
                        font-size: 10px
                        color: rgb(147, 153, 159)
                        line-height: 10px
                    .desc
                        margin: 8px 0
                    .ratings
                        margin-left: 12px
                    .price
                        margin-top: 8px
                        .new-price
                            font-size: 14px
                            color: rgb(240, 20, 20)
                            font-weight: 700
                            line-height: 14px
                        .old-price
                            font-size: 10px
                            color: rgb(147, 153, 159)
                            font-weight: 700
                            text-decoration: line-through
                .cartcontrol-wrapper
                    position: absolute
                    right: 0px
                    bottom: 18px
</style>
