'use strict';

const { Client } = require('ssh2');

function connect(host, port, user, password) {
	return new Promise((resolve, reject) => {
		const sftp = new Client();

        sftp.on('ready', () => {
            sftp.sftp((error, conn) => {
                if (error) { throw error; }
                resolve(conn);
            });
        })
        sftp.on('error', reject);

        const params = {
            host: host,
            port: port,
            user: user,
            password: password,
        };
        sftp.connect(params);
	});
}

function disconnect(conn) {
    conn._client.end();
}

function downloadFile(conn, ftpFilePath, localFilePath) {
    return new Promise((resolve, reject) => {
        conn.fastGet(ftpFilePath, localFilePath, (error) => {
            if (error) { return reject(error); }
            resolve(localFilePath);
        });
    });
}

function uploadFile(conn, localFilePath, ftpFilePath) {
	return new Promise((resolve, reject) => {
		conn.fastPut(localFilePath, ftpFilePath, (error) => {
            if (error) { return reject(error); }
            resolve(ftpFilePath);
        });
	});
}

function createFolder(conn, ftpFolder) {
    return new Promise((resolve, reject) => {
		conn.readdir(ftpFolder, (error) => {
			if (!error) { return resolve(ftpFolder); }
			conn.mkdir(ftpFolder, (error) => {
				if (error) { return reject(error); }
				resolve(ftpFolder);
			});
		});
	});
}

function getFileList(conn, ftpFolder) {
    return new Promise((resolve, reject) => {
        conn.readdir(ftpFolder, (error, fileList) => {
            if (error) { return reject(error); }
			resolve(fileList);
        });
    });
}

// EXPORTS

module.exports = {
    connect,
	disconnect,

	downloadFile,
	uploadFile,
	createFolder,
	getFileList
};