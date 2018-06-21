'use strict';

const conn = require('./connection.js');
const env = require('./env.js').environment;
const verify = require('./verify.js');
const socketio = require('socket.io');
const redisAdapter = require('socket.io-redis');
const redis = require('redis');
const http = require('http');
const app = require('express')();
const connectionString = require('./env').mainDbConnectionUrl;
const mongoose = require('mongoose');

const options = {
	port: env.port,
	debug: true,
	errorHandler: function (err) { console.log(err); }
};

require('sticky-cluster')(
	function (callback) {
		const server = http.createServer(app);
		const io = socketio(server);
		io.set('transports', ['websocket']);

		if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
			io.adapter(redisAdapter({host: env.redisHost, port: env.redisPort}));
		} else if (process.env.NODE_ENV === 'production') {
			const pub = redis.createClient(env.redisPort, env.redisHost, {auth_pass: env.redisPass});
			const sub = redis.createClient(env.redisPort, env.redisHost, {auth_pass: env.redisPass});
			io.adapter(redisAdapter({pubClient: pub, subClient: sub}));
		}

		mongoose.connect(connectionString);
		mongoose.connection
			.once('open', () => {
				//console.log('Server connected to ' + connectionString + '');
			})
			.on('error', (error) => {
				console.warn('Warning', error.toString());
			});

		io.on('connection', (socket) => {
			conn.onConnection(io, socket);
		});

		callback(server);
	}, options
);

app.get('/', (req, res) => {
	res.sendfile('./the-circle.html');
});
