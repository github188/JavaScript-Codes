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
            <div v-if="seller.supports" class="supports-count"  @click="showDetail">
                <span class="sp-count">{{seller.supports.length}}个</span>
                <icon name="chevron-right" class="chevron-right"></icon>
                <!-- <i class="icon-keyboard_arrow_right"></i> -->
            </div>
        </div>
        <div class="bulletin-wrapper"  @click="showDetail">
            <span class="bull-icon"></span><span class="bull-text">{{seller.bulletin}}</span>
            <icon name="chevron-right" class="chevron-right"></icon>
        </div>
        <div class="background">
            <img :src="seller.avatar" width="100%" height="100%">
        </div>
        <transition name="fade">
            <div v-show="detailShow" class="detail">
                <div class="detail-wrapper clearfix">
                    <div class="detail-main">
                        <h1 class="detail-title">{{seller.name}}</h1>
                        <div class="star-wrapper">
                            <star :score="seller.score" :size="48"></star>
                        </div>
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">优惠信息</div>
                            <div class="line"></div>
                        </div>
                        <ul v-if="seller.supports" class="supports">
                            <li v-for="support in seller.supports" class="support-item">
                                <span class="sp-icon" :class="classMap[support.type]"></span>
                                <span class="sp-text">{{support.description}}</span>
                            </li>
                        </ul>
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">商家公告</div>
                            <div class="line"></div>
                        </div>
                        <div class="bulletin">
                            <div class="content">{{seller.bulletin}}</div>
                        </div>
                    </div> 
                </div>
                <div class="detail-close" @click="hideDetail">
                    <icon name="close" class="close"></icon>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>

import star from '../stars/stars.vue';

export default {
    data() {
        return {
            detailShow: false
        };
    },

    methods: {
        showDetail() {
            this.detailShow = true;
        },

        hideDetail() {
            this.detailShow = false;
        }
    },

    props: {
        seller: {
            type: Object
        }
    },

    components: {
        star
    },

    created() {
        this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">

@import '../../common/stylus/mixin.styl'
    
.header
    position: relative
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
                    background-repeat: no-repeat
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
            .chevron-right
                margin-top: 5px
                transform: scale(0.8)
                line-height: 24px
    .bulletin-wrapper
        position: relative
        height: 28px
        line-height: 28px
        padding: 0 22px 0 12px
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
        background-color: rgba(7, 17, 27, 0.2)
        .bull-icon
            display: inline-block
            vertical-align: top
            margin-top: 8px
            width: 22px
            height: 12px
            bg-img('imgs/bulletin')
            background-size: 22px 12px
            background-repeat: no-repeat
        .bull-text
            vertical-align: top
            margin: 0 4px
            font-size: 10px
        .chevron-right
            position: absolute
            right: 12px
            margin-top: 7px
            transform: scale(0.5)
    .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        filter: blur(10px)
    .detail
        position: fixed
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: 100
        overflow: auto
        backdrop-filter: blur(10px)
        background-color: rgba(7, 17, 27, 0.8)
        &.fade-enter-active, &.fade-leave-active
            transition: all 0.5s
            background-color: rgba(7, 17, 27, 0.8)
        &.fade-enter, &.fade-leave-active
            opacity: 0
            background-color: rgba(7, 17, 27, 0)
        .detail-wrapper
            width: 100%
            min-height: 100%
            .detail-main
                margin-top: 64px
                padding-bottom: 64px
                .detail-title
                    font-size: 16px
                    font-weight: 700
                    line-height: 16px
                    text-align: center
                .star-wrapper
                    margin-top: 16px
                    height: 24px
                    text-align: center
                .title
                    display: flex
                    width: 80%
                    margin: 28px auto 24px
                    .line
                        flex: 1
                        position: relative
                        top: -8px
                        border-bottom: 1px solid rgba(255, 255, 255, 0.2)
                    .text
                        margin: 0 12px
                        font-size: 14px
                        font-weight: 700
                .supports
                    width: 80%
                    margin: 0 auto
                    .support-item
                        height: 16px
                        line-height: 16px
                        font-size: 0
                        margin: 0 12px
                        margin-bottom: 12px
                        &:last-child
                            margin-bottom: 0
                        .sp-icon
                            display: inline-block
                            width: 16px
                            height: 16px
                            margin-right: 6px
                            background-size: 16px 16px
                            vertical-align: top
                            &.decrease
                                bg-img('imgs/decrease_2')
                            &.discount
                                bg-img('imgs/discount_2')
                            &.guarantee
                                bg-img('imgs/guarantee_2')
                            &.invoice
                                bg-img('imgs/invoice_2')
                            &.special
                                bg-img('imgs/special_2')
                        .sp-text
                            font-size: 12px
                            font-weight: 200
                            color: rgb(255, 255, 255)
                .bulletin
                    width: 80%
                    margin: 0 auto
                    .content
                        padding: 0 12px
                        font-size: 12px
                        line-height: 24px                  
        .detail-close
            position: relative
            width: 32px
            height: 32px
            margin: -64px auto 0 auto
            font-size: 32px
            color: rgba(255, 255, 255, 0.5)
            clear: both
            transform: scale(2)

</style>
