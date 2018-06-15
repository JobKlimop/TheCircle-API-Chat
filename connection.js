const winston = require('./logging.js');
const env = require('./env.js').environment;

function onConnection(io) {
	io.on('connection', (socket) => {
		let user = false;
		let rooms = [];

		function getConnectionInfo() {
			return {
				user: user,
				rooms: rooms,
				server: env.host,
				dyno: env.dyno,
				pid: process.pid
			};
		}

		socket.on('authenticate', (auth) => {
			console.log(auth);
		});

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
					timestamp: msg.timestamp,
					content: msg.content,
					certificate: msg.certificate,
					signature: msg.signature
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

		socket.on('history', (room) => {
			const index = rooms.indexOf(room);
			if (index > -1) {
				//TODO get history from MongoDB
				let history = [];
				const obj = {
					room: room,
					history: history
				};
				socket.emit('history', obj);
			}
		});
	});
}

module.exports = {
	onConnection
};
