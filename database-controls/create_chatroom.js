const Chatroom = require('../models/chatroom');
let newChatroom = {owner: '', messages: []};

function createChatroom(owner) {
	newChatroom.owner = owner;

	return Chatroom.findOne({owner: owner})
		.then((dbChatroom) => {
			if (dbChatroom === null) {
				return Chatroom.create(newChatroom);
			} else {
				return dbChatroom;
			}
		})
		.then(() => {
			return true;
		})
		.catch((error) => {
			console.log(error);
			return false;
		});
}

module.exports = createChatroom;