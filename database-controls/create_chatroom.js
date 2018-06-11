const Chatroom = require('../models/chatroom');
let newChatroom = {owner: '', messages: []};

function createChatroom(owner) {
	newChatroom.owner = owner;

	return Chatroom.findOne({owner: owner})
		.then((dbResponse) => {
			if (dbResponse === null) {
				return Chatroom.create(newChatroom);
			} else {
				return dbResponse;
			}
		})
		.catch((error) => {
			return error;
		});
}

module.exports = createChatroom;