'use strict';

const env = require('./env.js');
const winston = require('winston');
require('winston-mongodb');

const loggingCredentials = env.logDbUser ? env.logDbUser + ':' + (env.logDbPass || env.logDbUser) + '@' : '';
const loggingConnection = 'mongodb://' + loggingCredentials + env.logDbHost + ':' + env.logDbPort + '/' + env.logDbName;

const options = {
	level: 'info',
	silent: false,
	db: loggingConnection,
	options: {poolSize: 2, autoReconnect: true},
	collection: 'log',
	storeHost: true,
	label: 'chat-server',
	name: 'transport-1',
	capped: false,
	cappedSize: 10000000,
	cappedMax: 10000000,
	tryReconnect: false,
	decolorize: false,
	expireAfterSeconds: 0
};

winston.add(winston.transports.MongoDB, options);
winston.remove(winston.transports.Console);

module.exports = winston;
