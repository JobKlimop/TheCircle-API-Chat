'use strict';

const io = require('socket.io-client');
const assert = require('assert');

let socket;

beforeEach((done) => {
	socket = io.connect('http://localhost:3000', {
		'reconnection delay': 0
		, 'reopen delay': 0
		, 'force new connection': true
	});

	socket.on('connect', () => {
		done();
	});

	socket.on('disconnect', () => {
	})
});

afterEach((done) => {
	if (socket.connected) {
		socket.disconnect();
	}
	done();
});

describe('Event Tests', () => {
	const username = 'Test-User';
	const room = 'test-room-1';

	it('Client should receive a username_set event after setting a username', (done) => {
		socket.emit('set_username', username);
		socket.on('username_set', (setUsername) => {
			assert(setUsername === username, "wrong user");
			done();
		});
	});

	it('Client should receive a room_joined event after joining a room', (done) => {
		socket.emit('join_room', room);
		socket.on('room_joined', (joinedRoom) => {
			assert(joinedRoom === room, "wrong room");
			done();
		});
	});

	it('Client should receive a room_left event after leaving a room', (done) => {
		socket.emit('join_room', room);
		socket.emit('leave_room', room);
		socket.on('room_left', (leftRoom) => {
			assert(leftRoom === room, "wrong room");
			done();
		});
	});

	it('Client should receive a client_count event after requesting a client count', (done) => {
		socket.emit('join_room', room);
		socket.emit('client_count', room);
		socket.on('client_count', (response) => {
			assert(response.room === room, "wrong room");
			done();
		});
	});

	it('Client should receive a connection_info event after requesting connection info', (done) => {
		socket.emit('set_username', username);
		socket.emit('join_room', room);
		socket.emit('connection_info');
		socket.on('connection_info', (info) => {
			assert(info.user === username, "wrong user");
			assert(info.rooms[0] === room, "wrong room");
			assert(info.rooms[1] === undefined, "second room should be undefined");
			done();
		});
	});

	it('Client should receive messages', (done) => {
		const content = "testing";
		const certificate = "cert";
		const signature = "sig";
		const timestamp = Date.now();
		const msg = {
			room: room,
			content: content,
			certificate: certificate,
			signature: signature,
			timestamp: timestamp
		};

		socket.emit('set_username', username);
		socket.emit('join_room', room);
		socket.emit('message', msg);
		socket.on('message', (msg) => {
			assert(msg.user === username, "wrong user");
			assert(msg.room === room, "wrong room");
			assert(msg.content === content, "wrong content");
			assert(msg.certificate === certificate, "wrong certificate");
			assert(msg.signature === signature, "wrong signature");
			assert(msg.timestamp === timestamp, "wrong timestamp");
			done();
		});
	});

});
