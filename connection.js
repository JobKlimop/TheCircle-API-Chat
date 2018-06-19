const winston = require('./logging.js');
const env = require('./env.js').environment;
const verify = require('./verify.js');
const connectionString = require('./env.js').mainDbConnectionUrl;
const mongoose = require('mongoose');
const createUser = require('./database-controls/create_user');
const createChatroom = require('./database-controls/create_chatroom');
const saveMessage = require('./database-controls/save_message');
const getHistory = require('./database-controls/get_history');

function onConnection(io, socket) {
	let verified = false;
	let identity = false;
	let user = false;
	let rooms = [];

	mongoose.connect(connectionString);
	mongoose.connection
		.once('open', () => {
			console.log('Server connected to ' + connectionString + '');
		})
		.on('error', (error) => {
			console.warn('Warning', error.toString());
		});

	function getConnectionInfo() {
		return {
			user: user,
			rooms: rooms,
			server: env.host,
			dyno: env.dyno,
			pid: process.pid,
			identity: identity
		};
	}

	socket.on('verify_identity', (obj) => {
		verify.verifyUserCert(obj.certificate)
			.then((result) => {
				verified = result;
				if (result === true) {
					identity = verify.getIdentityFromCert(obj.certificate);
					if (identity.commonName) user = identity.commonName;
					socket.emit('verified', true);
					createUser(identity.commonName, obj.certificate)
						.catch((error) => {
							console.log('Creating user failed with error response --> ' + error);
						});
					winston.log(
						'info',
						(user || '[SocketID ' + socket.id + ']') + ' verified their identity: ' + identity,
						getConnectionInfo()
					);
				} else {
					socket.emit('verified', false);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	});

	socket.on('connection_info', () => {
		if (verified) {
			const info = getConnectionInfo();
			socket.emit('connection_info', info);
		}
	});

	socket.on('join_room', (room) => {
		const index = rooms.indexOf(room);
		if (index === -1 && verified) {
			socket.join(room);
			rooms.push(room);
			socket.emit('room_joined', room);
			createUser(room, {placeholder: 'placeholder'})
				.catch((error) => {
					console.log('Creating user failed with error response --> ' + error);
				});
			createChatroom(room)
				.catch((error) => {
					console.log('Creating chatroom failed with error response --> ' + error);
				});
			winston.log(
				'info',
				(user || '[SocketID ' + socket.id + ']') + ' joined room ' + room,
				getConnectionInfo()
			);
		}
	});

	socket.on('leave_room', (room) => {
		const index = rooms.indexOf(room);
		if (index > -1 && verified) {
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
		if (index > -1 && verified) {
			const obj = {
				user: user,
				room: msg.room,
				timestamp: msg.timestamp,
				content: msg.content,
				certificate: msg.certificate,
				signature: msg.signature
			};
			io.in(msg.room).emit('message', obj);
			saveMessage(msg.content, user, msg.room, msg.timestamp, msg.signature)
				.catch((error) => {
					console.log('Saving message failed with error response --> ' + error);
				});
			winston.log(
				'info',
				'Received message from ' + (user || '[SocketID ' + socket.id + ']') + ' for room ' + msg.room + ': ' + msg.content,
				getConnectionInfo()
			);
		}
	});

	socket.on('client_count', (room) => {
		const index = rooms.indexOf(room);
		if (index > -1 && verified) {
			io.in(room).clients((err, clients) => {
				const obj = {
					room: room,
					numberOfClients: clients.length
				};
				socket.emit('client_count', obj);
			});
		}
	});

	socket.on('history', (room) => {
		const index = rooms.indexOf(room);
		if (index > -1 && verified) {
			let history = [];
			getHistory(room)
				.then((retrievedMessages) => {
					history = retrievedMessages;
					let obj = {
						room: room,
						history: history
					};
					socket.emit('history', obj);
				});
		}
	});
}

module.exports = {
	onConnection
};
