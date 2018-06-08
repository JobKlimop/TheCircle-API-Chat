const cluster = require('cluster');
const sio = require('socket.io');
const sio_redis = require('socket.io-redis');
const http = require('http');
const sticky = require('sticky-session');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
	res.end('worker: ' + cluster.worker.id);
});

if (!sticky.listen(server, port)) {
	// Master code
	server.once('listening', () => {
		console.log('server started on port ' + port);
	});
} else {
	// Worker code
	const io = sio(server);

	//io.adapter(sio_redis({host: 'localhost', port: 6379}));

	io.on('connection', (socket) => {
		let userName = false;
		let roomName = false;

		console.log('user connected on worker #' + cluster.worker.id);

		socket.on('username', (user) => {
			userName = user;
			console.log('user supplied username ' + userName);
		});

		socket.on('room', (room) => {
			socket.join(room);
			roomName = room;
			console.log('user joined room ' + roomName);
		});

		socket.on('message', (user, msg) => {
			console.log(user + ': ' + msg);
		});
		setTimeout(() => {
			io.to('test-room').emit('message', 'dit moet naar iedereen in test-room');
		}, 5000);
	});
}
