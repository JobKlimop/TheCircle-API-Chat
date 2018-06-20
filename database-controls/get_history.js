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
				let messageArray = [];
				for (let i = 0; i < retrievedChatroom.messages.length; i++) {
					const m = retrievedChatroom.messages[i];
						let object = {
							user: m.user._id,
							room: m.room,
							timestamp: m.timestamp.getTime(),
							content: m.content,
							certificate: m.user.certificate,
							signature: m.signature
						};
						messageArray.push(object)
					}
				resolve(messageArray);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

module.exports = getHistory;