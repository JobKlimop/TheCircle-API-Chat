'use strict';

const forge = require('node-forge');
const fs = require('fs');
const crypto = require('crypto');

function verifyUserCert(cert) {
	const pki = forge.pki;
	fs.readFile('root.crt', (error, data) => {
		const authority = pki.certificateFromPem(data.toString());
		return authority.verify(cert);
	});
}

function getIdentityFromCert(cert) {
	const subject = cert.subject;
	return {
		commonName: subject.getField('CN').value,
		countryName: subject.getField('C').value,
		stateOrProvinceName: subject.getField('ST').value,
		localityName: subject.getField('L').value,
		organizationName: subject.getField('O').value,
		organizationalUnitName: subject.getField('OU').value,
		emailAddress: subject.getField('E').value
	};
}

function verifySignature(data, signature, cert) {
	const verify = crypto.createVerify('SHA256');
	verify.update(data);
	return verify.verify(cert, signature);
}

module.exports = {
	verifyUserCert,
	getIdentityFromCert,
	verifySignature
};
