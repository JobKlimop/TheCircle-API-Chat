const User = require('../models/user');
let newUser = {name: '', certificate: {}, messages: []};

function createUser(name, certificate) {
	newUser.name = name;
	newUser.certificate = certificate;

	return User.findOne({name: name})
		.then((dbUser) => {
			if (dbUser === null) {
				return User.create(newUser);
			} else {
				return dbUser;
			}
		})
		.then(() => {
			return true;
		})
		.catch((error) => {
			console.log(error);
			return false;
		})
}