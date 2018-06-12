const Message = require('../models/message');
const User = require('../models/user');
const Chatroom = require('../models/chatroom');
let newMessage = {content: '', user: '', chatroom: '', timestamp: Date.now(), signature: ''};

function saveMessage(content, user, chatroom, timestamp, signature) {
	newMessage.content = content;
	newMessage.user = user;
	newMessage.chatroom = chatroom;
	newMessage.timestamp = timestamp;
	newMessage.signature = signature;

	return Message.create(newMessage)
		.then(() => {
			return true;
		})
		.catch((error) => {
			console.log(error);
			return false;
		});
}

module.exports = saveMessage;