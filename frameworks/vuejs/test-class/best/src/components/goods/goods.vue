<template>
    <div class="goods">
        <div class="menu-wrapper">
            <ul>
                <li v-for="item in goods" class="menu-item" :class="{'current': currIndex===$index}" @click="selectMenu($index, $event)">
                    <span class="text">
                        <span v-show="item.type > 0" :class="classMap[item.type]" class="icon"></span>{{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <div class="food-wrapper">
            <ul>
                <li v-for="item in goods" class="food-list">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <li v-for="food in item.foods">
                            <div class="icon">
                                <img :src="food.icon">
                            </div>
                            <div class="content">
                                <h2>{{food.name}}</h2>
                                <span>{{food.description}}</span>
                                <div>
                                    <span>月售{{food.sellCount}}份</span>
                                    <span>好评率{{food.rating}}%</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            goods: []
        };
    },

    computed: {
        currIndex() {
            return 0;
        }
    },

    methods: {
        selectMenu(index, e) {
        }
    },

    created() {
        this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];

        this.$http.get('/api/goods').then((response) => {
            let _res = response.body;
            if (_res.errno === 0) {
                this.goods = [].slice.call(_res.data, 0);
                console.log(this.goods);
            }
        });
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
        padding: 0 12px
        background: #f3f5f7
        .menu-item
            display: table
            width: 56px
            height: 54px
            font-size: 12px
            line-height: 14px
            &.current
                position: relative
                z-index: 10
                margin-top: -1px
                background-color: #fff
                font-weight: 200
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
                height: 28px
                background: #f3f5f7
                font-size: 12px
                color: rgb()
</style>
