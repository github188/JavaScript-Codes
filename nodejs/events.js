// load events module
var events = require("events");

// create event instance
var eventEmitter = new events.EventEmitter();

// connection event handler
var connectHandler = function() {
	console.log("connect event handler!");

	// trigger other event
	// trigger data_received event
	eventEmitter.emit("data_received");
};

// bind connect event
eventEmitter.on("connection", connectHandler);


// data_received event
eventEmitter.on("data_received", function(){
	console.log("data received finished!");
});

// trigger connection event
eventEmitter.emit("connection");


console.log("all events finised!");
