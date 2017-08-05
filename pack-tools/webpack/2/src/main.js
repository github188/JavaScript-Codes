import Name from './name.js';
import './styles/main.css';
import './styles/a.scss';
import './styles/a.styl';
import './styles/a.less';
import '../assets/simon-test.csv';
import Data from '../assets/data.json';
import XmlData from '../assets/data.xml';
import _ from 'lodash';

import Vue from 'Vue';
import App from './components/App.vue';
new Vue(App).$mount('#app');

const app = () => {
    console.log('js name: ' + Name.app + ', vendor name: ' + Name.vendor);
    console.log('json name: ' + Data.name + ', age: ' + Data.age);
    console.log('xml name: ' + XmlData.personal.name
                + ', xml age: ' + XmlData.personal.age
               );
    console.log('env: ' + process.env.NODE_ENV);
};

// 这里是个注释，打包后消失
app();

// print();

function component() {
    var el = document.createElement('div');
    var btn = document.createElement('button');
    var br = document.createElement('br');

    btn.innerHTML = '请点击我，查看控制台输出';
    el.innerHTML = _.join(['Hello', 'webpack'], ' ');
    el.appendChild(br);
    el.appendChild(btn);

    // 这里注意要使用 System.import 不能直接使用 import
    btn.onclick = e => System.import(/* webpackChunkName: "print" */ './print').then(module => {
        var print = module.default;

        print();
    });

    return el;
}

document.body.appendChild(component());
