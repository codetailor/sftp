'use strict';

const test = require('tape');
const sftp = require('../index');

// Source: https://www.sftp.net/public-online-sftp-servers

test('Connect to a free SFTP server', async (t) => {
	let conn = await sftp.connect('test.rebex.net', 22, 'demo', 'password');
	t.ok(conn);
	sftp.disconnect();
});

