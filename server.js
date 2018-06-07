const cluster = require('cluster');
const sio = require('socket.io');
const sio_redis = require('socket.io-redis');
const http = require('http');
const sticky = require('sticky-session');

const port = process.env.PORT || 3000;

const server = http.createServer(function (req, res) {
	res.end('worker: ' + cluster.worker.id);
});

if (!sticky.listen(server, port)) {
	// Master code
	server.once('listening', function () {
		console.log('server started on 3000 port');
	});
} else {
	// Worker code
	const io = sio(server);

	//io.adapter(sio_redis({host: 'localhost', port: 6379}));

	io.on('connection', function (socket) {
		console.log('user connected on worker #' + cluster.worker.id);
		socket.emit('message', 'test test test message');
		socket.on('message', function (user, msg) {
			console.log(user + ': ' + msg);
		});
	});
}
