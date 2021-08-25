'use strict';

const test = require('tape');
const sftp = require('../index');

const fs = require('fs');
const path = require('path');

// Source: https://www.sftp.net/public-online-sftp-servers
const FTP_HOST = 'test.rebex.net';
const FTP_PORT = 22;
const FTP_USER = 'demo';
const FTP_PASS = 'password';
const FTP_TEST_FILE = 'readme.txt';

test('Connect to a free SFTP server', async (t) => {
	const conn = await sftp.connect(FTP_HOST, FTP_PORT, FTP_USER, FTP_PASS);
	t.ok(conn);
	sftp.disconnect();
});

test('Download a file from a free SFTP server', async (t) => {
	const conn = await sftp.connect(FTP_HOST, FTP_PORT, FTP_USER, FTP_PASS);
	const res = await sftp.downloadFile(conn, FTP_TEST_FILE, path.join('test', FTP_TEST_FILE));
	t.ok(res);
	sftp.disconnect();
	fs.unlinkSync(path.join('test', FTP_TEST_FILE));
});