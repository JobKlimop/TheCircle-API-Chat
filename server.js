'use strict';

const cluster = require('cluster');
const socketio = require('socket.io');
const redisAdapter = require('socket.io-redis');
const redis = require('redis');
const http = require('http');
const sticky = require('sticky-session');
const fs = require('fs');
const winston = require('./logging.js');
const env = require('./env.js');

const server = http.createServer((req, res) => {
	fs.readFile('the-circle.html', (err, data) => {
		res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': data.length});
		res.write(data);
		res.end();
	});
});

if (!sticky.listen(server, env.port)) {
	// Master code
	server.once('listening', () => {
		console.log('server started on port ' + env.port);
	});
} else {
	// Worker code
	const io = socketio(server);

	if (process.env.NODE_ENV === 'development') {
		io.adapter(redisAdapter({host: env.redisHost, port: env.redisPort}));
	} else if (process.env.NODE_ENV === 'production') {
		const pub = redis.createClient(env.redisPort, env.redisHost, {auth_pass: env.redisPass});
		const sub = redis.createClient(env.redisPort, env.redisHost, {auth_pass: env.redisPass});
		io.adapter(redisAdapter({pubClient: pub, subClient: sub}));
	}

	io.on('connection', (socket) => {
		let user = false;
		let rooms = [];

		function getConnectionInfo() {
			return {
				user: user,
				rooms: rooms,
				server: env.host,
				dyno: env.dyno,
				worker: cluster.worker.id
			};
		}

		socket.on('connection_info', () => {
			const info = getConnectionInfo();
			socket.emit('connection_info', info);
		});

		socket.on('set_username', (username) => {
			user = username;
			socket.emit('username_set', user);
			winston.log(
				'info',
				(user || '[SocketID ' + socket.id + ']') + ' changed their username to ' + username,
				getConnectionInfo()
			);
		});

		socket.on('join_room', (room) => {
			const index = rooms.indexOf(room);
			if (index === -1) {
				socket.join(room);
				rooms.push(room);
				socket.emit('room_joined', room);
				winston.log(
					'info',
					(user || '[SocketID ' + socket.id + ']') + ' joined room ' + room,
					getConnectionInfo()
				);
			}
		});

		socket.on('leave_room', (room) => {
			const index = rooms.indexOf(room);
			if (index > -1) {
				rooms.splice(index, 1);
				socket.emit('room_left', room);
				winston.log(
					'info',
					(user || '[SocketID ' + socket.id + ']') + ' left room ' + room,
					getConnectionInfo()
				);
			}
		});

		socket.on('message', (msg) => {
			const index = rooms.indexOf(msg.room);
			if (index > -1 && user) {
				const obj = {
					user: user,
					room: msg.room,
					timestamp: Date.now(),
					content: msg.content
				};
				io.in(msg.room).emit('message', obj);
				winston.log(
					'info',
					'Received message from ' + (user || '[SocketID ' + socket.id + ']') + ' for room ' + msg.room,
					getConnectionInfo()
				);
			}
		});

		socket.on('client_count', (room) => {
			const index = rooms.indexOf(room);
			if (index > -1) {
				io.in(room).clients((err, clients) => {
					const obj = {
						room: room,
						numberOfClients: clients.length
					};
					socket.emit('client_count', obj);
				});
			}
		});
	});
}
