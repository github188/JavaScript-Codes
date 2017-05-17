<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="nav border-1px">
        <div class="nav-item">
            <router-link to="/goods">商品</router-link>
        </div>
        <div class="nav-item">
            <router-link to="/ratings">评论</router-link>
        </div>
        <div class="nav-item">
            <router-link to="/seller">商家</router-link>
        </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import header from '@/components/headers/header.vue';

const ERROR_OK = 0;

export default {
    name: 'app',

    data() {
        return {
            seller: {}
        };
    },

    created() {
        this.$http.get('/api/seller').then((res) => {
            // 请求商家数据
            var _res = res.body;
            if (_res.errno === ERROR_OK) {
                this.seller = _res.data;
            }
        });
    },

    components: {
        'v-header': header
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">

@import 'common/stylus/index.styl'

#app
    .nav
        display: flex
        width: 100%
        height: 40px
        line-height: 40px
        border-1px(rgba(7, 17, 27, 0.2))
        .nav-item
            flex: 1
            text-align: center
            & > a
                display: block
                font-size: 14px
                color: rgb(77, 85, 93)
                &.active
                    color: rgb(240, 20, 20)
            
</style>
