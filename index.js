'use strict';

const { Client, SFTPWrapper } = require('ssh2');
const { FileEntry } = require('ssh2-streams');

/**
 * Connects to SFTP server
 *
 * @param { string } host SFTP host
 * @param { number } port SFTP port (usually 22)
 * @param { string } user SFTP user
 * @param { string } password SFTP password
 * @returns { SFTPWrapper } SFTP connection handle
 */
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

/**
 * Disconnects from SFTP server
 *
 * @param { SFTPWrapper } conn SFTP connection handle
 */
function disconnect(conn) {
    conn._client.end();
}

/**
 * Downloads a file from SFTP server
 *
 * @param { SFTPWrapper } conn SFTP connection handle
 * @param { string } ftpFilePath SFTP file path (origin)
 * @param { string } localFilePath Local file path (destination)
 * @returns { string } Local file path (destination)
 */
function downloadFile(conn, ftpFilePath, localFilePath) {
    return new Promise((resolve, reject) => {
        conn.fastGet(ftpFilePath, localFilePath, (error) => {
            if (error) { return reject(error); }
            resolve(localFilePath);
        });
    });
}

/**
 * Uploads a file to SFTP server
 *
 * @param { SFTPWrapper } conn SFTP connection handle
 * @param { string } localFilePath Local file path (origin)
 * @param { string } ftpFilePath SFTP file path (destination)
 * @returns { string } SFTP file path (destination)
 */
function uploadFile(conn, localFilePath, ftpFilePath) {
	return new Promise((resolve, reject) => {
		conn.fastPut(localFilePath, ftpFilePath, (error) => {
            if (error) { return reject(error); }
            resolve(ftpFilePath);
        });
	});
}

/**
 * Creates a folder in SFTP server
 *
 * @param { SFTPWrapper } conn SFTP connection handle
 * @param { string } ftpFolder SFTP folder to create
 * @returns { string } SFTP folder that was created
 */
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

/**
 * Gets the file list from a folder in SFTP server
 *
 * @param { SFTPWrapper } conn SFTP connection handle
 * @param { string } ftpFolder SFTP folder to read
 * @returns { FileEntry[] } Files list from SFTP folder
 */
function getFileList(conn, ftpFolder) {
    return new Promise((resolve, reject) => {
        conn.readdir(ftpFolder, (error, fileList) => {
            if (error) { return reject(error); }
			fileList = fileList.map(x => {
				x.is_folder = (x.longname[0] === 'd');
				return x;
			});
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