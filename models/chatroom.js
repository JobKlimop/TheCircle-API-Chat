const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatroomSchema = new Schema({
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: [true, 'A chatroom must have an owner.']
	},
	messages: [{
		type: Schema.Types.ObjectId,
		ref: 'message'
	}]
});

const Chatroom = mongoose.model('chatroom', ChatroomSchema);

module.exports = Chatroom;