const Chatroom = require('../models/chatroom');

function createChatroom(roomOwner) {
	let newChatroom = {roomOwner: '', messages: []};
	newChatroom.roomOwner = roomOwner;

	return new Promise((resolve, reject) => {
		Chatroom.create(newChatroom)
			.then((createdChatroom) => {
				resolve(createdChatroom);
			})
			.catch((error) => {
				if (error.code !== 11000) {
					reject(error);
				} else {
					return Chatroom.findById(roomOwner);
				}
			})
			.then((retrievedChatroom) => {
				resolve(retrievedChatroom);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

module.exports = createChatroom;