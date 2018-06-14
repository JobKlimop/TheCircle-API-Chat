const User = require('../models/user');

function createUser(name, certificate) {
	let newUser = {name: '', certificate: {}, messages: []};
	newUser.name = name;
	newUser.certificate = certificate;

	return new Promise((resolve, reject) => {
		User.findById(name)
			.then((dbUser) => {
				if (dbUser === null) {
					return User.create(newUser);
				} else {
					return dbUser;
				}
			})
			.then((dbUser) => {
				resolve(dbUser);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

module.exports = createUser;