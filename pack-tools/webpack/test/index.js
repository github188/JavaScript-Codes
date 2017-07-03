// import Promise from 'bluebird';
import Vue from 'vue';
import VueRouter from 'vue-router';

import App from "App";

Vue.use(VueRouter);

var router = new VueRouter();
router.map({
    "/app": {
        component: App,
    },
});

// router.redirect({ '/': '/firstcategory' });
router.start(App, '#app');

// Welcome.el = '#app';
// new Vue(Welcome);
