
var publisher = require('./pubsub');

function Subcriber(name) {
	this.name = name;	

	this.update = function ( data ) {
		console.log( this.name + ' update ' + data );
	}
}

var sub1 = new Subcriber('lizc'),
	sub2 = new Subcriber('fll');


publisher.subscribe(sub1, 'news');
publisher.subscribe(sub1, 'news');
publisher.subscribe(sub1, 'news');
publisher.subscribe(new Subcriber('liwy'), 'news');