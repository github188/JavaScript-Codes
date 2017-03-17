'use strict';

var p1 = new Promise(function (resolve, reject) {
    setTimeout(function () {
        throw new Error('error message.');
    }, 2000);
});

var p2 = new Promise(function (resolve, reject) {
    resolve();
});

p2.then(p1).catch(function (error) {
    return console.log(error);
});