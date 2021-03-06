'use strict';

const mongoose = require('mongoose');
const assert = require('assert');
const createUser = require('../database-controls/create_user');
const createChatroom = require('../database-controls/create_chatroom');
const saveMessage = require('../database-controls/save_message');
const getHistory = require('../database-controls/get_history');
const User = require('../models/user');
const Chatroom = require('../models/chatroom');
const Message = require('../models/message');
const connection = require('../env.js').mainDbConnectionUrl;
const moment = require('moment');

mongoose.Promise = global.Promise;

describe('Database-controls', () => {
	before((done) => {
		mongoose.connect(connection);
		mongoose.connection
			.once('open', () => {
				done();
			})
			.on('error', (error) => {
				console.warn('Warning', error.toString());
			});
	});

	beforeEach((done) => {
		const {users, messages, chatrooms} = mongoose.connection.collections;

		messages.remove({})
			.then(() => {
				return chatrooms.remove({});
			})
			.then(() => {
				return users.remove({});
			})
			.then(() => {
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	after((done) => {
		const {users, messages, chatrooms} = mongoose.connection.collections;

		messages.remove({})
			.then(() => {
				return chatrooms.remove({});
			})
			.then(() => {
				return users.remove({});
			})
			.then(() => {
				mongoose.disconnect()
					.then(() => {
						done();
					})
					.catch((error) => {
						console.log(error);
					});
			})
			.catch((error) => {
				done(error);
			});
	});

	it('should save a user successfully.', (done) => {
		User.findById('TestingUser123')
			.then((dbResponse) => {
				assert(dbResponse === null);
				createUser('TestingUser123', {certificate: 'A4LS2#$lPQ99))2AVB'})
					.then((createdUser) => {
						assert(createdUser._id === 'TestingUser123');
						assert(createdUser.certificate.certificate === 'A4LS2#$lPQ99))2AVB');
						done();
					})
					.catch((error) => {
						console.log(error);
					});
			})
			.catch((error) => {
				console.log(error);
			})
	});

	it('should return the user with given name if already exists when creating.', (done) => {
		User.create({name: 'TestingUser123', certificate: {certificate: 'A4LS2#$lPQ99))2AVB'}, messages: []})
			.then(() => {
				createUser('TestingUser123', {certificate: 'A4LS2#$lPQ99))2AVB'})
					.then((retrievedUser) => {
						assert(retrievedUser._id === 'TestingUser123');
						assert(retrievedUser.certificate.certificate === 'A4LS2#$lPQ99))2AVB');
						done();
					})
					.catch((error) => {
						console.log(error);
					})
			})
			.catch((error) => {
				console.log(error);
			});
	});

	it('should save a chatroom succesfully.', (done) => {
		Chatroom.findById('TestingRoom123')
			.then((dbResponse) => {
				assert(dbResponse === null);
				createChatroom('TestingRoom123')
					.then((createdChatroom) => {
						assert(createdChatroom._id === 'TestingRoom123');
						done();
					})
					.catch((error) => {
						console.log(error);
					})
			})
			.catch((error) => {
				console.log(error);
			})
	});

	it('should return the chatroom with given roomOwner if already exists when creating.', (done) => {
		Chatroom.create({roomOwner: 'TestingRoom123', messages: []})
			.then(() => {
				createChatroom('TestingRoom123')
					.then((retrievedChatroom) => {
						assert(retrievedChatroom._id === 'TestingRoom123');
						done();
					})
					.catch((error) => {
						console.log(error);
					})
			})
			.catch((error) => {
				console.log(error);
			});
	});

	it('should save a message succesfully and add it to relevant messages list.', (done) => {
		let currentDate = Date.now();
		let _savedMessage;

		User.create({name: 'TestingUser123', certificate: {certificate: ''}})
			.then(() => {
				return Chatroom.create({roomOwner: 'TestingRoom123'});
			})
			.then(() => {
				return saveMessage('Testing message content...', 'TestingUser123', 'TestingRoom123', currentDate,
					'1A2FC26DC7EA5A2A4748B7CB2B1EF193D96AB2C99F93092F69E63075B28D1278');
			})
			.then((savedMessage) => {
				assert(savedMessage.content === 'Testing message content...');
				_savedMessage = savedMessage;
				return User.findById('TestingUser123');
			})
			.then((dbUser) => {
				assert(dbUser.messages.indexOf(_savedMessage._id) !== -1);
				return Chatroom.findById('TestingRoom123');
			})
			.then((dbChatroom) => {
				assert(dbChatroom.messages.indexOf(_savedMessage._id) !== -1);
				done();
			})
			.catch((error) => {
				console.log(error);
			});
	});

	it('should return 10 messages when connecting to a room.', function (done) {
		this.timeout(10000);

		let now;
		let testMessageArray = [];
		let chatroom;

		for (let i = 0; i <= 14; i++) {
			let testMessage = {content: '...', user: 'TestUser', chatroom: 'TestRoom', timestamp: Date.now(), signature: 'Signature...'};
			if (i === 14) {
				now = new Date(moment().add(i, 'seconds').format());
			}
			testMessage.timestamp = moment().add(i, 'seconds').format();
			testMessageArray.push(testMessage);
		}

		Chatroom.create({roomOwner: "TestRoom", messages: []})
			.then((createdChatroom) => {
				chatroom = createdChatroom;
				return User.create({name: 'TestUser', certificate: 'TestingCertificate'});
			})
			.then(() => {
				return Message.create(testMessageArray);
			})
			.then((createdMessages) => {
				for (let i = 0; i <= 14; i++) {
					chatroom.messages.push(createdMessages[i]);
				}
				return chatroom.save();
			})
			.then(() => {
				return getHistory(chatroom._id);
			})
			.then((history) => {
				assert(history.length === 10);
				assert(history[0].timestamp === now.getTime());
				assert(history[0].timestamp > history[9].timestamp);
				done();
			})
			.catch((error) => {
				console.log(error);
			})
	});
});