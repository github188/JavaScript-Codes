

import hello from './hello';

import '../styles/a.css';
import '../styles/b.css';
import '../styles/c.css';


// import { moment } from 'moment';


function determineDate() {
    import('moment')
        .then(function (moment) {
            console.log(moment().format());
        })
        .catch(function (err) {
            console.log('load moment module failed. ', err);
        });
}