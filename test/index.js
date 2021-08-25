'use strict';

require('dotenv').config({ path: 'test/.env' });

const test = require('tape');
const sftp = require('../index');

const fs = require('fs');
const path = require('path');

const FTP_HOST = process.env.FTP_HOST;
const FTP_PORT = process.env.FTP_PORT;
const FTP_USER = process.env.FTP_USER;
const FTP_PASS = process.env.FTP_PASS;
const FTP_ROOT_FOLDER = process.env.FTP_ROOT_FOLDER;
const FTP_TEST_FILE = path.join(FTP_ROOT_FOLDER, 'test.txt');

test('Connect to SFTP server', async (t) => {
	// Test
	const conn = await sftp.connect(FTP_HOST, FTP_PORT, FTP_USER, FTP_PASS);

	// Check
	t.ok(conn);

	// Cleanup
	sftp.disconnect(conn);
});

test('Download a file from SFTP server', async (t) => {
	// Init
	const conn = await sftp.connect(FTP_HOST, FTP_PORT, FTP_USER, FTP_PASS);

	// Test
	const localFilePath = path.join('test', 'test.txt');
	const res = await sftp.downloadFile(conn, FTP_TEST_FILE, localFilePath);

	// Check
	t.ok(res);

	// Cleanup
	sftp.disconnect(conn);
	fs.unlinkSync(localFilePath);
});

test('Upload a file to SFTP server', async (t) => {
	// Init
	const conn = await sftp.connect(FTP_HOST, FTP_PORT, FTP_USER, FTP_PASS);
	const localFilePath = path.join('test', 'test-up.txt');
	fs.writeFileSync(localFilePath, 'FTP upload test');
	const ftpFilePath = path.join(FTP_ROOT_FOLDER, 'test-up.txt');

	// Test
	const res = await sftp.uploadFile(conn, localFilePath, ftpFilePath);

	// Check
	t.ok(res);

	// Cleanup
	sftp.disconnect(conn);
	fs.unlinkSync(localFilePath);
});