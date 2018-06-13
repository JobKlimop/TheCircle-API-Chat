'use strict';

const mongoose = require('mongoose');
const assert = require('assert');
const createUser = require('../database-controls/create_user');
const createChatroom = require('../database-controls/create_chatroom');
const saveMessage = require('../database-controls/save_message');
const User = require('../models/user');
const Chatroom = require('../models/chatroom');

mongoose.Promise = global.Promise;

before((done) => {
	mongoose.connect('mongodb://Admin:AdminTC123@ds255970.mlab.com:55970/thecircle_chat_test');
	mongoose.connection
		.once('open', () => {
			console.log('Connected to MongoDB testing database hosted on mLab.');
			done();
		})
		.on('error', (error) => {
			console.warn('Warning', error.toString());
		});
});

describe('Database-controls', () => {
	beforeEach((done) => {
		const { users, messages, chatrooms } = mongoose.connection.collections;

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

	it('should save a user successfully.', (done) => {
		User.findOne({_id: 'TestingUser123'})
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
		Chatroom.findOne({_id: 'TestingRoom123'})
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

	it('should return the chatroom with given owner if already exists when creating.', (done) => {
		Chatroom.create({owner: 'TestingRoom123', messages: []})
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
				return Chatroom.create({owner: 'TestingRoom123'});
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
});