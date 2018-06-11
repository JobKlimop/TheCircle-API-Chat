'use strict';

const winston = require('winston');
const cluster = require('cluster');
const socketio = require('socket.io');
const redisAdapter = require('socket.io-redis');
const redis = require('redis');
const http = require('http');
const sticky = require('sticky-session');
const ip = require('ip');
const fs = require('fs');

const host = process.env.HOST || ip.address();
const dyno = process.env.DYNO || false;
const port = process.env.PORT || 3000;
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;
const redisPass = process.env.REDIS_PASS || false;

const server = http.createServer((req, res) => {
	fs.readFile('the-circle.html', (err, data) => {
		res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': data.length});
		res.write(data);
		res.end();
	});
});

require('winston-mongodb');
const options = {
	level: 'info',
	silent: false,
	db: 'mongodb://test:test123@ds161148.mlab.com:61148/the-circle-chat-server-logging',
	options: {poolSize: 2, autoReconnect: true},
	collection: 'log',
	storeHost: true,
	label: 'chat-server',
	name: 'transport-1',
	capped: false,
	cappedSize: 10000000,
	cappedMax: 10000000,
	tryReconnect: false,
	decolorize: false,
	expireAfterSeconds: 0
};

// winston.add(winston.transports.File, { filename: 'test.log' });
winston.add(winston.transports.MongoDB, options);

if (!sticky.listen(server, port)) {
	// Master code
	server.once('listening', () => {
		console.log('server started on port ' + port);
	});
} else {
	// Worker code
	const io = socketio(server);

	if (process.env.NODE_ENV === 'development') {
		io.adapter(redisAdapter({host: redisHost, port: redisPort}));
	} else if (process.env.NODE_ENV === 'production') {
		const pub = redis.createClient(redisPort, redisHost, {auth_pass: redisPass});
		const sub = redis.createClient(redisPort, redisHost, {auth_pass: redisPass});
		io.adapter(redisAdapter({pubClient: pub, subClient: sub}));
	}

	io.on('connection', (socket) => {
		let user = false;
		let rooms = [];

		winston.log('info', socket.id + ' connected on worker #' + cluster.worker.id);

		socket.on('connection_info', () => {
			const info = {
				user: user,
				rooms: rooms,
				server: host,
				dyno: dyno,
				worker: cluster.worker.id
			};
			socket.emit('connection_info', info);
		});

		socket.on('set_username', (username) => {
			user = username;
			socket.emit('username_set', user);
		});

		socket.on('join_room', (room) => {
			const index = rooms.indexOf(room);
			if (index === -1) {
				socket.join(room);
				rooms.push(room);
				socket.emit('room_joined', room);
			}
		});

		socket.on('leave_room', (room) => {
			const index = rooms.indexOf(room);
			if (index > -1) {
				rooms.splice(index, 1);
				socket.emit('room_left', room);
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
