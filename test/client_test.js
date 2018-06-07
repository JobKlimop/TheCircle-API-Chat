let socket = require('socket.io-client')('http://localhost:3000');

socket.on('connect', function () {
	console.log("Connected");
	socket.emit('message', 'Henk', 'Dit is een message.');
});

socket.on('message', function (message) {
	console.log(message);
});

socket.on('disconnect', function () {
	console.log("Disconnected");
});
