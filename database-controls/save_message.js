const Chatroom  = require('../models/chatroom');
let newMessage = {content: '', authorId: 0, timestamp: Date.now()};

function saveMessage(content, authorId, roomOwner) {
	newMessage.content = content;
	newMessage.authorId = authorId;
	newMessage.timestamp = Date.now();

	return Chatroom.findOne({owner: roomOwner})
		.then((chatroom) => {
			chatroom.messages.push(newMessage);
			chatroom.save();
			return chatroom;
		})
		.catch((error) => {
			return error;
		});
}

module.exports = saveMessage;