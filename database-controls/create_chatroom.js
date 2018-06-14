const Chatroom = require('../models/chatroom');

function createChatroom(roomOwner) {
	let newChatroom = {roomOwner: '', messages: []};
	newChatroom.roomOwner = roomOwner;

	return new Promise((resolve, reject) => {
		Chatroom.findById(roomOwner)
			.then((dbChatroom) => {
				console.log('newChatroom --> ' + newChatroom.roomOwner);
				console.log('Retrieved result with given name: ' + roomOwner + ' - ' + dbChatroom);
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