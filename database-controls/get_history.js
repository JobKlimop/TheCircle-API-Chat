const Chatroom = require('../models/chatroom');

function getHistory(roomOwner) {
	return new Promise((resolve, reject) => {
		Chatroom.findById(roomOwner)
			.populate({
				path: 'messages',
				options: { limit: 10, sort: '-timestamp'},
				populate: {
					path: 'user',
					select: 'certificate'
				}
			})
			.then((retrievedChatroom) => {
				resolve(retrievedChatroom.messages);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

module.exports = getHistory;