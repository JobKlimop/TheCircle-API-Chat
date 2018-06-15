'use strict';

const crypto = require('crypto');
const x509 = require('x509');
const forge = require('node-forge');

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

//const certParsed = x509.parseCert(cert);

const pki = forge.pki;

const caStore = pki.createCaStore([pem]);

const cert = pki.certificateFromPem(pem);
console.log(cert.subject.getField('CN').value);
