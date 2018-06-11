const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
	content: {
		type: String,
		required: [true, 'A comment must have content.']
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: [true, 'A message must have an author.']
	},
	chatroom: {
		type: Schema.Types.ObjectId,
		ref: 'chatroom',
		required: [true, 'A message must have a chatroom.']
	},
	timestamp: {
		type: Date,
		required: [true, 'A comment must have a timestamp.']
	},
	signature: {
		type: String,
		required: [true, 'Message must have a signature.']
	}
});

const Message = mongoose.model('message', MessageSchema);

module.exports = Message;