const Chatroom = require('../models/chatroom');

function getHistory(roomOwner) {
	return new Promise((resolve, reject) => {
		Chatroom.findById(roomOwner).populate('messages')
			.then((retrievedChatroom) => {
				resolve(retrievedChatroom.messages);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

module.exports = getHistory;