'use strict';

const { Client } = require('ssh2');

let _sftp = null;

function connect(host, port, user, password) {
	return new Promise((resolve, reject) => {
		_sftp = new Client();

        _sftp.on('ready', () => {
            _sftp.sftp((error, conn) => {
                if (error) { throw error; }
                resolve(conn);
            });
        })
        _sftp.on('error', reject);

        let params = {
            host: host,
            port: port,
            user: user,
            password: password,
        };
        _sftp.connect(params);
	});
}

function disconnect() {
    _sftp.end();
}

function downloadFile(conn, ftpFilePath, localFilePath) {
    return new Promise((resolve, reject) => {
        conn.fastGet(ftpFilePath, localFilePath, (error) => {
            if (error) { return reject(error); }
            resolve(localFilePath);
        });
    });
}

// EXPORTS

module.exports = {
    connect,
	disconnect,

	downloadFile
};