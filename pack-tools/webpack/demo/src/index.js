/**
   webpack demo
**/

import Vue from 'Vue';
import VueRouter from 'vue-router';
import VurResource from 'vue-resource';
import Hello from './components/Hello';

Vue.use(VueRouter);

var router = new VueRouter({
    routes: [
        {
            path: '/',
            name: 'Hello',
            component: Hello
        },
    ]
});



