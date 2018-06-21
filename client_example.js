// const host = "ws://localhost:3000";
const host = "ws://the-circle-chat.herokuapp.com/";

// Connect to socket.io server.
let socket = require("socket.io-client")(host, {
	transports: ['websocket'],
	rejectUnauthorized: false
});

const username = 'mika';
const room = 'test-room-1';
const userCert = '-----BEGIN CERTIFICATE-----\r\n' +
	'MIIEfDCCAmSgAwIBAgIBATANBgkqhkiG9w0BAQUFADCBmTELMAkGA1UEBhMCTkwx\r\n' +
	'FjAUBgNVBAgMDU5vb3JkLUJyYWJhbnQxDjAMBgNVBAcMBUJyZWRhMRMwEQYDVQQK\r\n' +
	'DApUaGUgQ2lyY2xlMRMwEQYDVQQLDApUaGUgQ2lyY2xlMRMwEQYDVQQDDApUaGUg\r\n' +
	'Q2lyY2xlMSMwIQYJKoZIhvcNAQkBFhR0aGVjaXJjbGVAdGhlLmNpcmNsZTAeFw0x\r\n' +
	'ODA2MjAwOTQ3MzBaFw0xOTA2MjAwOTQ3MzBaMGkxDTALBgNVBAMTBG1pa2ExCzAJ\r\n' +
	'BgNVBAYTAk5MMRYwFAYDVQQIEw1Ob29yZC1CcmFiYW50MQ4wDAYDVQQHEwVCcmVk\r\n' +
	'YTETMBEGA1UEChMKVGhlIENpcmNsZTEOMAwGA1UECxMFVXNlcnMwggEiMA0GCSqG\r\n' +
	'SIb3DQEBAQUAA4IBDwAwggEKAoIBAQCSKZltqDNxXh51aKAfTo5tNdkwVcuNtWKL\r\n' +
	'9KI2zZLLzpdlgYslOKdTKqcbUmo/09L6wEhNj9li2RzaZi98dzKNa20g/x66zpA5\r\n' +
	'7zBPs+E6Pho6egz1kMn98VHm36OqWZu5/Z/XdJN2ypB5T1dTIKuYcuFvKpoo19VV\r\n' +
	'MEDunig+U42ajS1SdGRpbhQkI7x8ajELA3WpvHxYF6amYrPNZqZeu7MSMq375G/e\r\n' +
	'kk9a7wKNcchgj9JtGDYkERo1en8UGWC3wWp6A5kpV8lyHNX2AJ+x9CKcAb4704cR\r\n' +
	'1c3T83saL9qqbRhzmswiOyYuIhWQXfsn5ocN/IAHm7OW3JAvig0HAgMBAAEwDQYJ\r\n' +
	'KoZIhvcNAQEFBQADggIBAEH+uX86YWCREwSvn0ruj2bExF7OIDkV+pHjexHqznPc\r\n' +
	'yJ0AJD9xqqdpg3QbVvP9vwNC8IzDXqf2Siy/YkMJIFVKHRgOZf73W4Arz959mlP3\r\n' +
	'64nxE1xc79v5Dq7Yj/GXAXMI3uWFwZlFp+hRD4QqQ4Hz9K/3OHZ5hW+24teYB71X\r\n' +
	'mgNMBq0cB+xWqmQapr5VD2vQPg7pKWjt//nAhhfPbjKN+LusM6/PkFx9Hq6GR0dx\r\n' +
	'VEj/7mglHlLnZf5hFJtPH6tvOQwyr/cQEw8M89ace/YlUk9WEGnmLQofoSyDeEuj\r\n' +
	'zVTXbgCbg/sy1wTz+2VbVoJnleadL1/VauBUs5vGhphsR4E40NArqcU87vyVtjvM\r\n' +
	'kDLsS+IBHIIYZeJ3qT33hWsLs6rsTZJ4vTTU3VqgIDajlqTi0ZI4zvGS8OEFtA+D\r\n' +
	'/HueMWszdQ/LFoWEIJmTT/tJVe9rhuBjbOJyJLnTjfj13vWsUoXh7ibZMR6JajV+\r\n' +
	'WoF/S+NQPaZ1pKw0QTDnaHRRZIqnh8qrVXOj+eEZk3z125OOpnRrc1RLWl+sqRhO\r\n' +
	'JtUaRoJgFS+T93/EOC/5t8+XP6UwlV3VgoyVhNShS5KnohDLNw0AU31Y+QO/pQ3T\r\n' +
	'8braAYT+a2VzsKyEKkWIyDFP4g7WYQ8X+sNigyaRavAaqjmhVcAt9GyRA7m94SCg\r\n' +
	'-----END CERTIFICATE-----\r\n';
const signature = '630a02809afc4935b7d32a9a6757d508c48e676585923152966a1c' +
	'fcad8df97712878d84caa018a21d2258dd893901e43c5f5240b9b3eb63e521628300' +
	'b77c7a4d618a5bad402f3d841d7669869d47ae4ab2e5bb101e10ff9a0d184cbf22e5' +
	'03859df3734e7997931f2ee457d7890cd48dfa344b7876d25ad6ce0146cb0b96ddff' +
	'cd6fdc3e1402431a92c72f17a380e113d8273b95a6fe0b06d583f5c4346b7fa93ff4' +
	'14da2611519267c73cfcd309771d48488f86a9476e71a87fce84c606ed263576cb8c' +
	'7180a1eb85f8c371a28b94140d48263dd601dd76fa6c7a0783d4592d7ea3424837d2' +
	'b9410dc204776cb91c5f36bcc3ff5a826120bcc61039ddf692';
const timestamp = 1529495763;
const content = 'sdfsdf';

addEventHandlers();

function addEventHandlers() {

	// BUILT-IN EVENTS

	// Fires after successfully connecting OR RECONNECTING to the server.
	socket.on("connect", () => {
		console.log("Connected");
		verifyIdentity(userCert);
		joinRoom("room-1");
		joinRoom("room-2");
		leaveRoom("room-2");
		sendMessage("room-1");
		sendMessage("room-2");
		getConnectionInfo();
		getHistory("room-1");
		getClientCount("room-1");
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

	socket.on("identity_verified", (identity) => {
		console.log(identity);
	});

	// Fires when receiving a message from the server.
	// contains the room the message is meant for, the message sender & the message itself
	socket.on("message", (message) => {
		console.log(message.timestamp + " " + message.room + " " + message.user + ": " + message.content);
	});

	// Fires when receiving connection info.
	// info contains:
	// 	    user        username associated with the connection
	// 		rooms       array of rooms the user is in
	// 		server      server url the user is connected to
	// 		dyno        heroku dyno the user is connected to
	// 		worker      worker the user is connected to
	socket.on("connection_info", (info) => {
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

	// Fires after receiving the amount of clients connected to a room.
	// Response contains the name of the room and the amount of clients connected to it.
	socket.on("client_count", (response) => {
		console.log(response.room + " has " + response.numberOfClients + " clients connected");
	});

	// Fires after receiving the message history of a room.
	socket.on("history", (response) => {
		console.log("Message history for room " + response.room + ": " + response.history.length + " messages");
	});
}

// Send a message to a room by emitting the "message" event and including the name of the room and your message.
// You can only send messages after providing a username by emitting the "set_username" event & by having joined the
// room you are sending the message to.
function sendMessage(room) {
	socket.emit("message", {
		room: room,
		content: content,
		timestamp: timestamp,
		certificate: userCert,
		signature: signature
	});
}

function verifyIdentity(cert) {
	socket.emit("verify_identity", {certificate: cert});
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

// Emit a "client_count" event to request the amount of connected clients of a given room you are in.
function getClientCount(room) {
	socket.emit("client_count", room);
}

// Emit a "history" event to request the message history of a room.
function getHistory(room) {
	socket.emit("history", room);
}
