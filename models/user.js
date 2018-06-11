const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: {
		type: String,
		required: [true, 'A user must have a name.']
	},
	messages: [{
		type: Schema.Types.ObjectId,
		ref: 'message'
	}]
});

const User = mongoose.model('user', UserSchema);

module.exports = User;