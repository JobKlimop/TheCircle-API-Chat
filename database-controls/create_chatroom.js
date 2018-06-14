const Chatroom = require('../models/chatroom');

function createChatroom(owner) {
	let newChatroom = {owner: '', messages: []};
	newChatroom.owner = owner;

	return new Promise((resolve, reject) => {
		Chatroom.findById(owner)
			.then((dbChatroom) => {
				if (dbChatroom === null) {
					return Chatroom.create(newChatroom);
				} else {
					return dbChatroom;
				}
			})
			.then((dbChatroom) => {
				resolve(dbChatroom);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

module.exports = createChatroom;