'use strict';

const ip = require('ip');

const environment = {
	host: process.env.HOST || ip.address(),
	dyno: process.env.DYNO || false,
	port: process.env.PORT || 3000,
	redisHost: process.env.REDIS_HOST || 'localhost',
	redisPort: process.env.REDIS_PORT || 6379,
	redisPass: process.env.REDIS_PASS || false,
	mainDbHost: process.env.MAIN_HOST || 'localhost',
	mainDbPort: process.env.MAIN_PORT || 27017,
	mainDbPass: process.env.MAIN_PASS || '',
	mainDbUser: process.env.MAIN_USER || '',
	mainDbName: process.env.MAIN_NAME || 'TheCircle',
	logDbHost: process.env.LOGGING_HOST || 'localhost',
	logDbPort: process.env.LOGGING_PORT || 27017,
	logDbPass: process.env.LOGGING_PASS || '',
	logDbUser: process.env.LOGGING_USER || '',
	logDbName: process.env.LOGGING_NAME || 'loggingdb',
	workers: process.env.NUMBER_WORKERS || require('os').cpus().length
};

const mainDbConnectionUrl = process.env.NODE_ENV === 'production' ?
	'mongodb://' + environment.mainDbUser + ':' + environment.mainDbPass + '@' + environment.mainDbHost + ':' +
	environment.mainDbPort + '/' + environment.mainDbName + '' :
	'mongodb://' + environment.mainDbHost + '/' + environment.mainDbName + '';

module.exports = {
	environment: environment,
	mainDbConnectionUrl: mainDbConnectionUrl
};
