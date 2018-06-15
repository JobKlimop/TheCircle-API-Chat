const User = require('../models/user');

function createUser(name, certificate) {
	let newUser = {name: '', certificate: {}, messages: []};
	newUser.name = name;
	newUser.certificate = certificate;

	return new Promise((resolve, reject) => {
		User.create(newUser)
			.then((createdUser) => {
				resolve(createdUser);
			})
			.catch((error) => {
				if (error.code !== 11000) {
					reject(error);
				} else {
					return User.findById(name);
				}
			})
			.then((retrievedUser) => {
				resolve(retrievedUser);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

module.exports = createUser;