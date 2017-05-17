<template>
    <div class="header">
    <div class="content-wrapper">
        <div class="avatar">
            <img :src="seller.avatar" width="64" height="64">
        </div>
        <div class="content">
            <div class="title">
                <span class="brand"></span>
                <span class="name">{{seller.name}}</span>
            </div>
            <div class="description">{{seller.description}}/{{seller.deliveryTime}}分钟送达</div>
            <div v-if="seller.supports" class="supports">
                <span class="sp-icon" :class="classMap[seller.supports[0].type]"></span>
                <span class="sp-text">{{seller.supports[0].description}}</span>
            </div>
        </div>
        <div v-if="seller.supports" class="supports-count">
            <span class="sp-count">{{seller.supports.length}}个</span>
            <icon name="flag" class=""></icon>
            <!-- <i class="icon-keyboard_arrow_right"></i> -->
        </div>
    </div>
    <div class="bulletin-wrapper"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {

        };
    },

    props: {
        seller: {
            type: Object
        }
    },

    created() {
        this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">

@import '../../common/stylus/mixin.styl'

.header
    overflow: hidden
    background: rgba(7, 17, 27, 0.5)
    color: #fff
    .content-wrapper
        position: relative
        padding: 24px 12px 18px 24px
        font-size: 0
        .avatar
            display: inline-block
            img
                border-radius: 2px
        .content
            display: inline-block
            vertical-align: top
            margin-left: 16px
            .title
                margin: 2px 0 8px 0
                .brand
                    display: inline-block
                    vertical-align: top
                    width: 30px
                    height: 18px
                    bg-img('imgs/brand')
                    background-size: 30px 18px
                    background-repeat: no-repeat
                .name
                    margin-left: 6px
                    font-size: 16px
                    font-weight: bold
                    line-height: 18px
            .description
                margin-bottom: 10px
                font-size: 12px
                line-height: 12px
            .supports
                .sp-icon
                    display: inline-block
                    margin-bottom: 2px
                    margin-right: 4px
                    vertical-align: top
                    width: 12px
                    height: 12px
                    background-size: 12px 12px
                    &.decrease
                        bg-img('imgs/decrease_1')
                    &.discount
                        bg-img('imgs/discount_1')
                    &.guarantee
                        bg-img('imgs/guarantee_1')
                    &.invoice
                        bg-img('imgs/invoice_1')
                    &.special
                        bg-img('imgs/special_1')
                .sp-text
                    font-size: 10px
                    line-height: 12px;
        .supports-count
            position: absolute
            right: 12px
            bottom: 14px
            padding: 7px 8px
            border-radius: 14px
            line-height: 24px
            height: 24px
            background-color: rgba(0, 0, 0, 0.2)
            .sp-count
                vertical-align: top
                font-size: 10px
                margin-right: 2px
            .icon-keyboard_arrow_right
                font-size: 10px
                
                


</style>
