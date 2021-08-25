'use strict';

const { Client } = require('ssh2');

const _conn = new Client();

function connect(host, port, user, password) {
	return new Promise((resolve, reject) => {
        _conn.on('ready', () => {
            _conn.sftp((error, sftp) => {
                if (error) { throw error; }
                resolve(sftp);
            });
        })
        _conn.on('error', reject);

        let params = {
            host: host,
            port: port,
            user: user,
            password: password,
        };
        _conn.connect(params);
	});
}

function disconnect() {
    _conn.end();
}

// EXPORTS

module.exports = {
    connect,
	disconnect
};