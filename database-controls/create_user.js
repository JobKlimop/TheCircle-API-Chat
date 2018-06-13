const User = require('../models/user');
let newUser = {name: '', certificate: {}, messages: []};

function createUser(name, certificate) {
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