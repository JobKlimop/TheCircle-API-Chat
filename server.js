const cluster = require("cluster");
const socketio = require("socket.io");
const redisAdapter = require("socket.io-redis");
const redis = require("redis");
const http = require("http");
const sticky = require("sticky-session");
const ip = require("ip");
const fs = require("fs");

const host = process.env.HOST || ip.address();
const dyno = process.env.DYNO || false;
const port = process.env.PORT || 3000;
const redisHost = process.env.REDIS_HOST || "localhost";
const redisPort = process.env.REDIS_PORT || 6379;
const redisPass = process.env.REDIS_PASS || false;

const server = http.createServer((req, res) => {
	fs.readFile('the-circle.html', (err, data) => {
		res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
		res.write(data);
		res.end();
	});
});

if (!sticky.listen(server, port)) {
	// Master code
	server.once("listening", () => {
		console.log("server started on port " + port);
	});
} else {
	// Worker code
	const io = socketio(server);

	if (process.env.DEV) {
		io.adapter(redisAdapter({ host: redisHost, port: redisPort }));
	} else {
		const pub = redis.createClient(redisPort, redisHost, { auth_pass: redisPass });
		const sub = redis.createClient(redisPort, redisHost, { auth_pass: redisPass });
		io.adapter(redisAdapter({ pubClient: pub, subClient: sub }));
	}

	io.on("connection", (socket) => {
		let user = false;
		let rooms = [];

		socket.on("connection_info", () => {
			const info = {
				user: user,
				rooms: rooms,
				server: host,
				dyno: dyno,
				worker: cluster.worker.id
			};

			socket.emit("connection_info", info);
		});

		socket.on("set_username", (username) => {
			console.log((user || "socketid " + socket.id) + " set username to " + username);
			user = username;
			socket.emit("username_set", user);
		});

		socket.on("join_room", (room) => {
			index = rooms.indexOf(room);
			if (index === -1) {
				socket.join(room);
				rooms.push(room);
				console.log((user || "socketid " + socket.id) + " joined room " + room);
				socket.emit("room_joined", room);
			}
		});

		socket.on("leave_room", (room) => {
			index = rooms.indexOf(room);
			if (index > -1) {
				rooms.splice(index, 1);
				console.log((user || "socketid " + socket.id) + " left room " + room);
				socket.emit("room_left", room);
			}
		});

		socket.on("message", (room, msg) => {
			index = rooms.indexOf(room);
			if (index > -1 && user) {
				console.log(room + " " + user + ": " + msg);
				io.in(room).emit('message', room, user, msg);
			}
		});
	});
}
