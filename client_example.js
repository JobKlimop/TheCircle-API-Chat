// Connect to socket.io server.
let socket = require("socket.io-client")("http://localhost:3000");

addEventHandlers();

function addEventHandlers() {

	// BUILT-IN EVENTS

	// Fires after successfully connecting OR RECONNECTING to the server.
	socket.on("connect", () => {
		console.log("Connected");
		setUsername("Henk");
		joinRoom("room-1");
		joinRoom("room-2");
		leaveRoom("room-2");
		sendMessage("room-1", "dit is een message naar room 1");
		sendMessage("room-2", "dit is een message naar room 2");
		getConnectionInfo();
	});

	// Fires after a connection error.
	socket.on('connect_error', (error) => {
		console.log(error);
	});

	// Fires after the connection times out.
	socket.on('connect_timeout', (timeout) => {
		console.log(timeout);
	});

	// Fires after an error.
	socket.on('error', (error) => {
		console.log(error);
	});

	// Fires after disconnecting from the server.
	socket.on("disconnect", (reason) => {
		console.log(reason);
	});

	// Fires after successfully reconnecting to the server.
	socket.on('reconnect', (attemptNumber) => {
		console.log("Reconnected after " + attemptNumber + " attempts");
	});

	// Fires after each reconnect attempt.
	// "reconnecting" event does the same.
	socket.on('reconnect_attempt', (attemptNumber) => {
		console.log("Trying to reconnect, attempt " + attemptNumber);
	});

	// Fires after a reconnection attempt error.
	socket.on('reconnect_error', (error) => {
		console.log(error);
	});

	// Fires after failing to reconnect after certain number of tries.
	socket.on('reconnect_failed', () => {
		console.log("Failed to reconnect");
	});

	// Fires when pinging the server, pinging happens automatically.
	socket.on('ping', () => {
		console.log("Pinging server...");
	});

	// Fires when a ping response is received from the server.
	socket.on('pong', (latency) => {
		console.log("Server latency: " + latency + "ms");
	});


	// CUSTOM EVENTS

	// Fires when receiving a message from the server.
	// contains the room the message is meant for, the message sender & the message itself
	socket.on("message", (room, user, message) => {
		console.log(room + " " + user + ": " + message);
	});

	// Fires when receiving connection info.
	// info contains:
	// 	    user        username associated with the connection
	// 		rooms       array of rooms the user is in
	// 		server      server url the user is connected to
	// 		dyno        heroku dyno the user is connected to
	// 		worker      worker the user is connected to
	socket.on("connection info", (info) => {
		console.log(info);
	});

	// Fires after joining a room.
	socket.on("room_joined", (room) => {
		console.log("Joined room " + room);
	});

	// Fires after leaving a room.
	socket.on("room_left", (room) => {
		console.log("Left room " + room);
	});

	// Fires after setting a username.
	socket.on("username_set", (username) => {
		console.log("Username set to " + username);
	});
}

// Send a message to a room by emitting the "message" event and including the name of the room and your message.
function sendMessage(room, message) {
	socket.emit("message", room, message);
}

// Before you can send messages, you need to provide a username.
// Do this by emitting the "set_username" event and sending your username.
function setUsername(username) {
	socket.emit("set_username", username);
}

// Subscribe to a room by emitting the "join_room" event and sending the name of the room you want to join.
// The name of the room is the username of the room owner (the streamer).
function joinRoom(room) {
	socket.emit("join_room", room);
}

// Unsubscribe from a room by emitting the "leave_room" event and sending the name of the room you want to leave.
// The name of the room is the username of the room owner (the streamer).
function leaveRoom(room) {
	socket.emit("leave_room", room);
}

// Emit a "connection_info" event to receive information about the connection (username, rooms joined, etc.).
function getConnectionInfo() {
	socket.emit("connection_info");
}
