'use strict';

const forge = require('node-forge');
const fs = require('fs');
const crypto = require('crypto');

const pki = forge.pki;

function verifyUserCert(cert) {
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
}

function getIdentityFromCert(cert) {
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
}

function verifySignature(data, signature, cert) {
	const verify = crypto.createVerify('SHA256withRSA');

	verify.update(data);
	return verify.verify(cert, signature);
}

module.exports = {
	verifyUserCert,
	getIdentityFromCert,
	verifySignature
};
