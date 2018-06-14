const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	_id: {
		type: String,
		alias: 'name'
	},
	certificate: {
		type: JSON,
		required: [true, 'A user must have a certificate.']
	},
	messages: [{
		type: Schema.Types.ObjectId,
		ref: 'message'
	}]
});

const User = mongoose.model('user', UserSchema);

module.exports = User;