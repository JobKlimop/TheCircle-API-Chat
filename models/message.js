const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
	content: {
		type: String,
		required: [true, 'A comment must have content.']
	},
	authorId: {
		type: Number,
		required: [true, 'A comment must have an author.']
	},
	timestamp: {
		type: Date,
		required: [true, 'A comment must have a timestamp.']
	}
});

module.exports = MessageSchema;