const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatroomSchema = new Schema({
	_id: {
		type: Schema.Types.String,
		ref: 'user',
		alias: 'roomOwner'
	},
	messages: [{
		type: Schema.Types.ObjectId,
		ref: 'message'
	}]
});

const Chatroom = mongoose.model('chatroom', ChatroomSchema);

module.exports = Chatroom;