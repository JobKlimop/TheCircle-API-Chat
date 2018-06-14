const Chatroom = require('../models/chatroom');
let newChatroom = {owner: '', messages: []};

function createChatroom(owner) {
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