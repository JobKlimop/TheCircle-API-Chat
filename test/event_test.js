'use strict';

const io = require('socket.io-client');
const assert = require('assert');

let socket;
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

describe('Event Tests', () => {
	beforeEach((done) => {
		socket = io.connect('http://localhost:3000', {
			'reconnection delay': 0,
			'reopen delay': 0,
			'force new connection': true,
			transports: ['websocket']
		});

		socket.on('connect', () => {
			socket.on("verified", (verified) => {
				if (verified) {
					done();
				}
			});
			socket.emit("verify_identity", {certificate: userCert});
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
		const msg = {
			room: room,
			content: content,
			certificate: userCert,
			signature: signature,
			timestamp: timestamp
		};

		socket.emit('join_room', room);
		socket.emit('message', msg);
		socket.on('message', (msg) => {
			assert(msg.user === username, "wrong user");
			assert(msg.room === room, "wrong room");
			assert(msg.content === content, "wrong content");
			assert(msg.certificate === userCert, "wrong certificate");
			assert(msg.signature === signature, "wrong signature");
			assert(msg.timestamp === timestamp, "wrong timestamp");
			done();
		});
	});

});
