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

/*
o.subscribe(f1);
o.subscribe(f2);

o.update("Tom回来了！")

//退订f1
o.unsubscribe(f1);
//再来验证
o.update("Tom回来了！");   
*/

/**
 * 杂志订阅
 * 	subscribers: 保存被观察者处理函数
 * 	subscribe()：订阅
 * 	unsubscribe()：退订
 * 	publish()：发布，对被观察者行为做出响应
 */

var publisher = {
	subscribers: {
		any: [] // 订阅者
	},

	// 订阅
	subscribe: function ( fn, type ) {

		type = type || 'any';
		if ( typeof this.subscribers[ type ] === "undefined" ) {
			this.subscribers[ type ] = [];
		}

		// 注册
		this.subscribers[ type ].push( fn );
	},

	// 退订
	unsubscribe: function ( fn, type ) {
		this.visitSubscribers( 'unsubscribe', fn, type );
	},

	// 发布
	publish: function ( publication, type ) {
		this.visitSubscribers( 'publish', publication, type );
	},

	visitSubscribers: function ( action, arg, type ) {
		var pubtype = type || 'any',
			subscribers = this.subscribers[ pubtype ],
			i,
			max = subscribers.length;

		for ( i = 0; i < max; i++ ) {
			if ( action === 'publish' ) {
				subscribers[ i ]( arg );
			} else {
				if ( subscribers[ i ] === arg ) {
					subscribers.splice( i , 1 );
				}
			}
		}
	}
};

function makePublisher( o ) {
	var i;
	for ( i in publisher ) {
		if ( publisher.hasOwnProperty( i ) && typeof publisher[ i ] === 'function' ) {
			o[ i ] = publisher[ i ];
		}
	}

	o.subscribers = { any: [] };
}

var me = {
	say: function () {
		this.publish( " who love me ? " );
	},
	run: function () {
		this.publish( " who will run with me ? ", "run" );
	}
};

makePublisher( me );

var loveMe = {
	toSay: function ( me ) {
		console.log( me + " Lily love you ! " );
	},
	toSayAgain: function ( me ) {
		console.log( me + " I am Lily, I love you !" );
	},
	toRun: function ( run ) {
		console.log( run + " Lily wish ! " );
	}
};

me.subscribe( loveMe.toSay );
me.subscribe( loveMe.toSayAgain );
me.subscribe( loveMe.toRun, "run" );


me.say();
// me.say();
// me.say();
me.run();


var paper = {
	daily: function () {
		this.publish( "big news today" );
	},

	monthly: function () {
		this.publish( "interesting analysis", "monthly" );
	}
};

// 将 paper 注册成发布者
makePublisher( paper );

// 订阅者
var joe = {
	drinkCoffee: function ( paper ) {
		console.log( 'Just read ' + paper );
	},
	sundayPreMap: function ( monthly ) {
		console.log( 'About to fall asleep reading this ' + monthly );
	}
};

paper.subscribe( joe.drinkCoffee );
paper.subscribe( joe.sundayPreMap, 'monthly' );


// paper.daily();
// paper.daily();
// paper.daily();
// paper.monthly();