'use strict';

const forge = require('node-forge');
const fs = require('fs');

const pem = "-----BEGIN CERTIFICATE-----\r\n" +
	"MIIDmTCCAoGgAwIBAgIBATANBgkqhkiG9w0BAQUFADBiMQ0wCwYDVQQDEwRtaWth\r\n" +
	"MQswCQYDVQQGEwJVUzEWMBQGA1UECBMNTm9vcmQtQnJhYmFudDEOMAwGA1UEBxMF\r\n" +
	"QnJlZGExDTALBgNVBAoTBFRlc3QxDTALBgNVBAsTBFRlc3QwHhcNMTgwNjExMTEz\r\n" +
	"NjI5WhcNMjAwNjEwMTEzNjI5WjBiMQ0wCwYDVQQDEwRtaWthMQswCQYDVQQGEwJV\r\n" +
	"UzEWMBQGA1UECBMNTm9vcmQtQnJhYmFudDEOMAwGA1UEBxMFQnJlZGExDTALBgNV\r\n" +
	"BAoTBFRlc3QxDTALBgNVBAsTBFRlc3QwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAw\r\n" +
	"ggEKAoIBAQCzwmx5oLjF3YFAZCZ0OfaZtnzvCd1fnRMo7cDbGHp3FQ9b2GCF8WRT\r\n" +
	"FTw5EPKlsq+5NN5Up2gZwL8OxYrjCu/ZOFNwrOHHxrSAFWYC2apMeL/KKetRjh5l\r\n" +
	"J4ppYmQwiSU8SoNzgJIZhgkqYdYWktGrqABRgtyFiLbGYSO5v7rb9WJIGZ5r438Q\r\n" +
	"15ocHIPhOCveVeBRBdhrw6QMxQfvZg3xmvixaQqqFg0QgE84ufPKf5XUBFkm449n\r\n" +
	"Ktij52Kr0CwMvkYYgPyJb1Rcvifu7lb9jT4QJTUtST7Leduj5rtw3xAg/nfwkqNZ\r\n" +
	"ge7eCzv04TqjFzDekN/IOcz3GFvZL2NdAgMBAAGjWjBYMAwGA1UdEwQFMAMBAf8w\r\n" +
	"CwYDVR0PBAQDAgL0MDsGA1UdJQQ0MDIGCCsGAQUFBwMBBggrBgEFBQcDAgYIKwYB\r\n" +
	"BQUHAwMGCCsGAQUFBwMEBggrBgEFBQcDCDANBgkqhkiG9w0BAQUFAAOCAQEAZXlA\r\n" +
	"Fjtai8kfDqWoGKnCD4PDtaavJ1+HClorHd3fyvcpyV+WRUZAXdAQHabpFwvzUjPG\r\n" +
	"FcD5qRAduTs/DVl6kq0FCEszZRODZTznboZ/CaW2HLltEg0VfIV+zGADn4WoTiPz\r\n" +
	"KA9jgpJokpNqZ+WFcl6ZPx/WIDiFtyc635j8ZHVhJvk28zkYJw4qLar1Y6sFVGDr\r\n" +
	"ncq85ASBNIiFjSriPyR0GBStkj0BP6FpRI5Coqtfol6Se5/U9Z7mcSi5rBKDSEK4\r\n" +
	"b29jNvEtzs7WO01O+61+l8UP30Dsb6W/pPFdTgPgu16tdFAbIhVe/urf7BXgQuVG\r\n" +
	"KNnzgGtzXCmDkHi5BQ==\r\n" +
	"-----END CERTIFICATE-----\r\n";

const pemLegit = "-----BEGIN CERTIFICATE-----\r\n" +
	"MIIEZTCCAk2gAwIBAgIBATANBgkqhkiG9w0BAQUFADCBgjEWMBQGA1UEAxMNVGhl\r\n" +
	"IENpcmNsZSBDQTELMAkGA1UEBhMCTkwxFjAUBgNVBAgTDU5vb3JkLUJyYWJhbnQx\r\n" +
	"DjAMBgNVBAcTBUJyZWRhMRMwEQYDVQQKEwpUaGUgQ2lyY2xlMR4wHAYDVQQLExVD\r\n" +
	"ZXJ0aWZpY2F0ZSBBdXRob3JpdHkwHhcNMTgwNjE1MTE1MjQwWhcNMTkwNjE1MTE1\r\n" +
	"MjQwWjBpMQ0wCwYDVQQDEwRtaWthMQswCQYDVQQGEwJOTDEWMBQGA1UECBMNTm9v\r\n" +
	"cmQtQnJhYmFudDEOMAwGA1UEBxMFQnJlZGExEzARBgNVBAoTClRoZSBDaXJjbGUx\r\n" +
	"DjAMBgNVBAsTBVVzZXJzMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA\r\n" +
	"mnaJeDtkuPbN1xViaM767JxXESyRsVbY6NDcrlbmTzpCw7P6lf9d6dSUXn5hPJLn\r\n" +
	"7OUwrbImeoYHcGWaGYQyFLBADIhs7JOVpthPGAuzQqlae6Pm7ulf6ZWrYcV8PBuQ\r\n" +
	"qAhT6v0AitL4qXR4flyUh5Sk59JTvxuUPO3/BC+wJFnLq8byg3FcYKQxrBlAc1Ag\r\n" +
	"2fixuYnZOCD7+NLhX6boHK4ONaj8DoT0Pmn95XwrAXYTRLpShbEDgkF8SK/PU2wa\r\n" +
	"4aZSD8x80rbnGWgSB609ZIOVL//lQ9xgl58w9pEYsuyPn7hfsGjs9zFd7gKixaZk\r\n" +
	"BQzDg+YZZw10xGiW9ngUPQIDAQABMA0GCSqGSIb3DQEBBQUAA4ICAQCkCSSAM0nC\r\n" +
	"pfd6nx6BAqIi9M227rS/TsUuOrP86BR3aKN9jUZ+u5Zr9peN2dRpsypimTbXK3WO\r\n" +
	"g1JUqnQbffzrkQab1K/NvWQt8jAXioLEr5ynC1mQdVC/ZEdWvkC0Wq8r8GOD+6HZ\r\n" +
	"KqBBDLAFxScVwa+UvPPyJcCMTBBcq+Y8pBE++deFd+YcnniLY4vMl4vZyWxpyEKQ\r\n" +
	"WdaEJPzbd37UDAPdclOFNqfC5FdE6hZe4ejSJBW08GVijsGNRI0jBd9M7GejPZxr\r\n" +
	"VpiDYXbPWNr7VjZps2rlk8Cl3hL4Q76wbjMNuRjgwygQypH5thx+5FiQGOn8lW1w\r\n" +
	"zSU502dl0kSuo4tEjcmEqa+tiSFTtclp72nyL9pt6Lr6UmZxX8nVMaTrBbNPwAy1\r\n" +
	"Oy8Yu2XJ2qgg05jC4pHRS88/HznVgVCYvblC/QtoxsS0h6Du79InriTrpF75i0CM\r\n" +
	"iQovGo0fm94r+RyVEJBbWK8Cv9BLGV9W3vdbsh3i5BkRF/I56vgstP2vIqciPSXC\r\n" +
	"QGOMDsj0dBw39oKTWofvmXE4/hxeEdm5xs6PyCVtM6TaGRXUBUdltFesSvZG5fAX\r\n" +
	"OUsO6b1zFFismKi9a3zOnChdyPhczbbEMSduAI3baiyxjlLAMbetyaEsrc2iJ8cV\r\n" +
	"wDm6kPxAwG0FK7Rk3yrCwiMuAWwpmvmvWw==\r\n" +
	"-----END CERTIFICATE-----\r\n";

const pki = forge.pki;
fs.readFile('root.crt', (err, cert) => {
	const rootPem = cert.toString();
	const rootCert = pki.certificateFromPem(rootPem);
	const userCert = pki.certificateFromPem(pem);
	const userCert2 = pki.certificateFromPem(pemLegit);

	console.log(rootCert.subject.getField('CN').value);
	console.log(userCert.issuer.getField('CN').value);
	console.log(userCert2.issuer.getField('CN').value);

	// const verified = rootCert.verify(userCert);
	// console.log(verified);
	//
	// const verified2 = rootCert.verify(userCert2);
	// console.log(verified2);

	//console.log(cert.subject.getField('CN').value);
});

function verifyUserCert(cert) {
	const pki = forge.pki;
	fs.readFile('root.crt', (error, data) => {
		const authority = pki.certificateFromPem(data.toString());
		return authority.verify(cert);
	});
}
