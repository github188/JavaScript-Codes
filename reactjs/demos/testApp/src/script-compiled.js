'use strict';

var hello = function hello() {
  return console.log('hello babel!');
};

hello();

var world = function world(str) {
  return console.log('hello ' + str);
};

world('world');

var print = function print(name) {
  return console.log('my name is: ' + name);
};

print('lizc');
