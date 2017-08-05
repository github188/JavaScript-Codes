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

             playUrl: 'http://113.136.46.36/iptv/clist/vod/yanguiren.ts',
             /* playUrl: 'http://42.236.123.10/iptv/clist/vod/yanguiren.ts',*/
             /* playUrl: "rtsp://113.136.33.132:554/vod/00000050280006000418.mpg?userid=123&stbip=10.222.91.158&clienttype=1&mediaid=0000000030010011162047&ifcharge=1&time=20170726102429+08&life=172800&usersessionid=478392&vcdnid=vcdn001&boid=001&srcboid=001&columnid=090000&backupagent=113.136.33.132:554&ctype=1&playtype=0&Drm=0&EpgId=null&programid=00000050280006000418&contname=&fathercont=&bp=0&authid=&tscnt=0&tstm=0&tsflow=0&ifpricereqsnd=1&stbid=0010039900E06800CH0F5CE3B6CE7252&nodelevel=3&terminalflag=1&bitrate=0&ottuserid=&usercharge=0ADF8EFD20ECC97F73EE85507C63B7AA"*/
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

         // for test
         sessionStorage.setItem('EPG_DEBUG_SWITCHER', 'open');
         this.$broadcast('echangeurl', this.playUrl);
     }
 }
</script>
