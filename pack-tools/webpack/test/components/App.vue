<style scoped>
#debug {
    position: fixed;
    left: 0;
    top: 0;
    width: 40%;
    height: 100%;
    background-color: black;
    color: white;
    z-index: 10000000;
    word-wrap: break-word;
    opacity: 0.5;
    overflow: scroll;
}
</style>
<template>
    <div>
        <m-player></m-player>
        <div id="debug" v-if="isDebug"></div>
    </div>
</template>
<script>
import mPlayer from './Tools/MediaPlayer.vue'
export default {
    data() {
        return {
            isDebug: false,

            // 播放相关的消息和按键
            mpEvents: [8, 768, 33, 34, 259, 260, 261],

            playUrl: 'http://42.236.123.10/iptv/clist/vod/yanguiren.ts',
        };
    },

    methods: {
        debug(obj) {

            if (!this.isDebug) { return; }

            const debug = document.getElementById('debug');

            let str = '';

            if (typeof(obj) === 'object') {
                str = JSON.stringify(obj);
            } else {
                str = '' + obj;
            }

            debug.innerHTML += '[' + str + ']';
        },

        eventHandler(event) {
            event = event ? event : window.event;
            let keycode = event.which ? event.which : event.keyCode;
            this.debug(keycode);

            // 播放器相关的按键和消息都交给播放器组件自己去处理
            // if (this.mpEvents.indexOf(keycode) >= 0) {
                this.$broadcast('ehandler', keycode);
                return false;
            // }
        },
    },

    components: {
        mPlayer,
    },

    ready() {

        document.onkeydown = (event) => {
            this.eventHandler(event);
            return false;
        };
        document.onkeypress = (event) => {
            this.eventHandler(event);
            return false;
        };

        this.$broadcast('echangeurl', this.playUrl);
    }
}
</script>