/**
 * 观察者模式，通过回调实现
 */
/*

var pubsub = {};

(function ( obj ) {
	var topics = [], // 回调函数数组
		subUid = -1;

	obj.publish = function ( topic, args ) {

		if ( !topics[topic] ) {
			return false;
		}

		setTimeout( function () {
			var subscribers = topics[topic],
				len = subscribers ? subscribers.length : 0;

			while ( len-- ) {
				subscribers[len].func( topic, args );
			}

		}, 0);

		return true;
	};

	obj.subscribe = function ( topic, func ) {
		if ( !topics[topic] ) {
			topics[topic] = [];
		}

		var token = (++subUid).toString();

		topics[topic].push({
			token: token,
			func: func
		});

		return token;
	};

	obj.unsubscribe = function ( token ) {
		for ( var idx in topics ) {
			if ( !topics.hasOwnProperty( idx ) ) {
				continue;
			}

			if ( topics[idx] ) {
				for ( var i = 0, len = topics[idx].length; i < len; i++ ) {
					if ( topics[idx][i].token === token ) {
						topics[idx].splice(i, 1);
						return token;
					}
				}
			}
		}
	};
} ( pubsub ));


var testSubscription = pubsub.subscribe( 'aaaaa', function ( topics, data ) {
	console.log( topics + ': ' + data );
} );

pubsub.publish( 'aaaaa', 'hello world!' );
pubsub.publish( 'aaaaa', ['test', 'a', 'b', 'c'] );
pubsub.publish( 'aaaaa', [{ 'color': 'blue'}, { 'text': 'hello' }]);

setTimeout(function () {
    pubsub.unsubscribe(testSubscription);
}, 0);

pubsub.publish('example1', 'hello again! (this will fail)');

*/


// 观察者模式基本原理：被观察者的对象中用一个数组保存观察者的回调函数
// 当被观察者对象发生变化时，调用其自身的变化函数，然后在该函数里面，处理观察者回调
// 函数数组，并且执行他们，从而达到被观察者发生变化时，观察者可以做出相应的变化


function Observer() {
    this.fns = [];
}
Observer.prototype = {
	
    subscribe: function (fn) {
        this.fns.push(fn);
    },

    // 退订，就是不观察了，删除函数
    unsubscribe: function (fn) {
        this.fns = this.fns.filter(
            function (el) {
                if (el !== fn) {
                    return el;
                }
            }
        );
    },

    // 更新，就是被观察者发生变化了，观察者需要做响应的变化
    update: function (o, thisObj) {
        var scope = thisObj || window;
        this.fns.forEach(
            function (el) {
                el.call(scope, o);
            }
        );
    }
};

// o 被观察的对象，f1, f2就是观察者，o发生改变调用update更新信息，f1和f2会随之发生改变
// 
var o = new Observer;
var f1 = function (data) {
    console.log('Robbin: ' + data + ', 赶紧干活了！');
};

var f2 = function (data) {
    console.log('Randall: ' + data + ', 找他加点工资去！');
};

o.subscribe(f1);
o.subscribe(f2);

o.update("Tom回来了！")

//退订f1
o.unsubscribe(f1);
//再来验证
o.update("Tom回来了！");   