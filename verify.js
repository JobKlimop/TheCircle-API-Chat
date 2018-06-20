'use strict';

const forge = require('node-forge');
const fs = require('fs');
const crypto = require('crypto');
const jsrsa = require('jsrsasign');

const pki = forge.pki;

function verifyUserCert(cert) {
	try {
		return new Promise(function (resolve, reject) {
			fs.readFile('root.crt', (error, data) => {
				if (error) {
					console.log(error);
					reject(error);
				}
				const authority = pki.certificateFromPem(data.toString());
				cert = pki.certificateFromPem(cert);
				const verified = authority.verify(cert);
				resolve(verified);
			});
		});
	} catch (e) {
		console.error(e);
	}
}

function getIdentityFromCert(cert) {
	try {
		cert = pki.certificateFromPem(cert);
		const subject = cert.subject;
		return {
			commonName: subject.getField('CN').value,
			countryName: subject.getField('C').value,
			stateOrProvinceName: subject.getField('ST').value,
			localityName: subject.getField('L').value,
			organizationName: subject.getField('O').value,
			organizationalUnitName: subject.getField('OU').value
		};
	} catch (e) {
		console.error(e);
	}
}

function hashMessage(content, timestamp) {
	try {
		const hash = crypto.createHash('sha256');
		hash.update(content + timestamp);
		return hash.digest('hex');
	} catch (e) {
		console.error(e);
	}
}

function verifySignature(data, signature, cert) {
	try {
		const sig = new jsrsa.KJUR.crypto.Signature({'alg': 'SHA256withRSA'});
		sig.init(cert);
		sig.updateString(data);
		return sig.verify(signature);
	} catch (e) {
		console.error(e);
	}
}

module.exports = {
	verifyUserCert,
	getIdentityFromCert,
	verifySignature,
	hashMessage
};
