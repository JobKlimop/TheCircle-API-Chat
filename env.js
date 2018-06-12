'use strict';

const ip = require('ip');

const host = process.env.HOST || ip.address();
const dyno = process.env.DYNO || false;
const port = process.env.PORT || 3000;
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;
const redisPass = process.env.REDIS_PASS || false;
const logDbHost = process.env.LOGGING_HOST || 'localhost';
const logDbPort = process.env.LOGGING_PORT || 27017;
const logDbPass = process.env.LOGGING_PASS || '';
const logDbUser = process.env.LOGGING_USER || '';
const logDbName = process.env.LOGGING_NAME || 'loggingdb';

module.exports = {
	host, dyno, port, redisHost, redisPort, redisPass, logDbHost, logDbPort, logDbPass, logDbUser, logDbName
};
