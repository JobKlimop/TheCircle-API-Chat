'use strict';

const verify = require('../verify');
const assert = require('assert');

const cert = '-----BEGIN CERTIFICATE-----\r\n' +
	'MIIEfDCCAmSgAwIBAgIBATANBgkqhkiG9w0BAQUFADCBmTELMAkGA1UEBhMCTkwx\r\n' +
	'FjAUBgNVBAgMDU5vb3JkLUJyYWJhbnQxDjAMBgNVBAcMBUJyZWRhMRMwEQYDVQQK\r\n' +
	'DApUaGUgQ2lyY2xlMRMwEQYDVQQLDApUaGUgQ2lyY2xlMRMwEQYDVQQDDApUaGUg\r\n' +
	'Q2lyY2xlMSMwIQYJKoZIhvcNAQkBFhR0aGVjaXJjbGVAdGhlLmNpcmNsZTAeFw0x\r\n' +
	'ODA2MjAwOTQ3MzBaFw0xOTA2MjAwOTQ3MzBaMGkxDTALBgNVBAMTBG1pa2ExCzAJ\r\n' +
	'BgNVBAYTAk5MMRYwFAYDVQQIEw1Ob29yZC1CcmFiYW50MQ4wDAYDVQQHEwVCcmVk\r\n' +
	'YTETMBEGA1UEChMKVGhlIENpcmNsZTEOMAwGA1UECxMFVXNlcnMwggEiMA0GCSqG\r\n' +
	'SIb3DQEBAQUAA4IBDwAwggEKAoIBAQCSKZltqDNxXh51aKAfTo5tNdkwVcuNtWKL\r\n' +
	'9KI2zZLLzpdlgYslOKdTKqcbUmo/09L6wEhNj9li2RzaZi98dzKNa20g/x66zpA5\r\n' +
	'7zBPs+E6Pho6egz1kMn98VHm36OqWZu5/Z/XdJN2ypB5T1dTIKuYcuFvKpoo19VV\r\n' +
	'MEDunig+U42ajS1SdGRpbhQkI7x8ajELA3WpvHxYF6amYrPNZqZeu7MSMq375G/e\r\n' +
	'kk9a7wKNcchgj9JtGDYkERo1en8UGWC3wWp6A5kpV8lyHNX2AJ+x9CKcAb4704cR\r\n' +
	'1c3T83saL9qqbRhzmswiOyYuIhWQXfsn5ocN/IAHm7OW3JAvig0HAgMBAAEwDQYJ\r\n' +
	'KoZIhvcNAQEFBQADggIBAEH+uX86YWCREwSvn0ruj2bExF7OIDkV+pHjexHqznPc\r\n' +
	'yJ0AJD9xqqdpg3QbVvP9vwNC8IzDXqf2Siy/YkMJIFVKHRgOZf73W4Arz959mlP3\r\n' +
	'64nxE1xc79v5Dq7Yj/GXAXMI3uWFwZlFp+hRD4QqQ4Hz9K/3OHZ5hW+24teYB71X\r\n' +
	'mgNMBq0cB+xWqmQapr5VD2vQPg7pKWjt//nAhhfPbjKN+LusM6/PkFx9Hq6GR0dx\r\n' +
	'VEj/7mglHlLnZf5hFJtPH6tvOQwyr/cQEw8M89ace/YlUk9WEGnmLQofoSyDeEuj\r\n' +
	'zVTXbgCbg/sy1wTz+2VbVoJnleadL1/VauBUs5vGhphsR4E40NArqcU87vyVtjvM\r\n' +
	'kDLsS+IBHIIYZeJ3qT33hWsLs6rsTZJ4vTTU3VqgIDajlqTi0ZI4zvGS8OEFtA+D\r\n' +
	'/HueMWszdQ/LFoWEIJmTT/tJVe9rhuBjbOJyJLnTjfj13vWsUoXh7ibZMR6JajV+\r\n' +
	'WoF/S+NQPaZ1pKw0QTDnaHRRZIqnh8qrVXOj+eEZk3z125OOpnRrc1RLWl+sqRhO\r\n' +
	'JtUaRoJgFS+T93/EOC/5t8+XP6UwlV3VgoyVhNShS5KnohDLNw0AU31Y+QO/pQ3T\r\n' +
	'8braAYT+a2VzsKyEKkWIyDFP4g7WYQ8X+sNigyaRavAaqjmhVcAt9GyRA7m94SCg\r\n' +
	'-----END CERTIFICATE-----\r\n';
const signature = '630a02809afc4935b7d32a9a6757d508c48e676585923152966a1c' +
	'fcad8df97712878d84caa018a21d2258dd893901e43c5f5240b9b3eb63e521628300' +
	'b77c7a4d618a5bad402f3d841d7669869d47ae4ab2e5bb101e10ff9a0d184cbf22e5' +
	'03859df3734e7997931f2ee457d7890cd48dfa344b7876d25ad6ce0146cb0b96ddff' +
	'cd6fdc3e1402431a92c72f17a380e113d8273b95a6fe0b06d583f5c4346b7fa93ff4' +
	'14da2611519267c73cfcd309771d48488f86a9476e71a87fce84c606ed263576cb8c' +
	'7180a1eb85f8c371a28b94140d48263dd601dd76fa6c7a0783d4592d7ea3424837d2' +
	'b9410dc204776cb91c5f36bcc3ff5a826120bcc61039ddf692';
const timestamp = 1529495763;
const content = 'sdfsdf';

describe('verify.js', () => {

	it('can verify a certificate', (done) => {
		verify.verifyUserCert(cert)
			.then((verified) => {
				assert(verified, 'not verified');
				done();
			});
	});

	it('can get identity from certificate', (done) => {
		const identity = verify.getIdentityFromCert(cert);
		assert(identity.commonName === 'mika', 'wrong commonName');
		assert(identity.countryName === 'NL', 'wrong countryName');
		assert(identity.stateOrProvinceName === 'Noord-Brabant', 'wrong stateOrProvinceName');
		assert(identity.localityName === 'Breda', 'wrong localityName');
		assert(identity.organizationName === 'The Circle', 'wrong organizationName');
		assert(identity.organizationalUnitName === 'Users', 'wrong organizationalUnitName');
		done();
	});

	it('can verify a signature', (done) => {
		const hash = verify.hashMessage(content, timestamp);
		const verified = verify.verifySignature(hash, signature, cert);
		assert(verified);
		done();
	});

	it('can filter empty messages', (done) => {
		const good = "asidjiudfsidf";
		const bad = "    \r\n    \r\n  ";
		assert(verify.messageFilter(good));
		assert(!verify.messageFilter(bad));
		done();
	});

});
