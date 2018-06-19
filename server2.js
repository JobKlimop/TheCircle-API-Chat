'use strict';

const conn = require('./connection.js');
const env = require('./env.js').environment;
const verify = require('./verify.js');
const socketio = require('socket.io');
const redisAdapter = require('socket.io-redis');
const redis = require('redis');
const http = require('http');
const app = require('express')();

const options = {
	port: env.port,
	debug: (process.env.NODE_ENV === 'development')
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

		io.on('connection', (socket) => {
			conn.onConnection(io, socket);
		});

		callback(server);
	}, options
);