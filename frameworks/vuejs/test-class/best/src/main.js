// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueResource from 'vue-resource';
import App from './App';
import router from './router';
import Icon from './components/Icon';
import './icons/index.js';

import '@/common/stylus/index.styl';

Vue.config.productionTip = false;

Vue.use(VueResource);

Vue.component('icon', Icon);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App, Icon }
});
