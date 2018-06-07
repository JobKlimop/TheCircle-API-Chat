const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MessageSchema = require('message');

const ChatroomSchema = new Schema({
	owner: {
		type: String,
		required: [true, 'A chatroom must have an owner.']
	},
	messages: [MessageSchema]
});

const Chatroom = mongoose.model('chatroom', ChatroomSchema);

module.exports = Chatroom;