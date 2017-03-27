/**
 * 发布者
 */

function Publisher() {
	
	this.subscribers = {};
}

Publisher.prototype._isSubscribed = function (subscriber, subject) {
	
	if ( ! subscriber || ! subject 
		|| ! this.subscribers.hasOwnProperty(subject) ) {
		return false;
	}

	var i = 0,
		len = this.subscribers[subject].length;

	for ( ; i < len; i++ ) {
		var obj = this.subscribers[subject][i];

		if ( obj.name === subscriber.name ) {
			console.log(subscriber.name + ' has subscribed ' + subject);
			return true;
		}
	}

	return false;
}

Publisher.prototype.subscribe = function ( subscriber, subject ) {

	if ( ! this.subscribers[subject] )	{
		this.subscribers[subject] = [];
	}

	if ( this._isSubscribed(subscriber, subject) ) {
		return false;
	}

	this.subscribers[subject].push(subscriber);

	console.log(this.subscribers);
}

Publisher.prototype.unsubscribe = function ( subscriber, subject ) {
	
	if ( !subscriber 
		|| ! this.subscribers.hasOwnProperty(subject) ) { 
		return false; 
	}

	var subscribeSubject = this.subscribers[subject],
		i = 0,
		len = subscribeSubject.length;

	for (; i < len; i++ ) {
		if (subscribeSubject[ i ] === subscriber ) {
			subscribeSubject.splice(i, 1);
			return true;
		}
	}

	return false;
}

Publisher.prototype.publish = function ( data, subject ) {

	var isPubAll = false;

	if ( !subject 
		|| ! this.subscribers.hasOwnProperty(subject) ) { 
		isPubAll = true; 
	}

	var me = this;
	if ( isPubAll ) {
		this._publishAll(publishOne);
	} else {
		this._publishOne(subject);
	}
}

Publisher.prototype._publishAll = function ( callback ) {
	for ( var subjecter in this.subscribers ) {
		if ( this.subscribers.hasOwnProperty(subjecter) ) {
			publishOne( subjecter );
		}
	}
}

Publisher.prototype._publishOne = function ( subject ) {
	var subscribers = this.subscribers[subject],
		i = 0, len = subscribers.length;

	for ( ; i < len; i++ ) {
		console.log(i)
		subscribers[i].update( data );
	}
}

module.exports = new Publisher();