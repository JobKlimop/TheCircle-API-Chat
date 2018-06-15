'use strict';

const cluster = require('cluster');
const socketio = require('socket.io');
const redisAdapter = require('socket.io-redis');
const redis = require('redis');
const http = require('http');
const sticky = require('sticky-session');
const fs = require('fs');
const env = require('./env.js').environment;
const conn = require('./connection');

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
		console.log('NODE_ENV: ' + process.env.NODE_ENV);
	});
} else {
	// Worker code
	const io = socketio(server);

	if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
		io.adapter(redisAdapter({host: env.redisHost, port: env.redisPort}));
	} else if (process.env.NODE_ENV === 'production') {
		const pub = redis.createClient({auth_pass: env.redisPass});
		const sub = redis.createClient(env.redisPort, env.redisHost, {auth_pass: env.redisPass});
		io.adapter(redisAdapter({pubClient: pub, subClient: sub}));
	}

	conn.onConnection(io, cluster);

}
