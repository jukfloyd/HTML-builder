const fsp = require('fs/promises');
const path = require('path');
const targetDir = path.join(path.dirname(__filename), 'secret-folder');

async function getFiles()
{
	try {
		const files = await fsp.readdir(targetDir);
		for (const file of files) {
			const fileStat = await fsp.stat(path.join(targetDir,file));
			if (fileStat.isFile()) {
				const parseFile = path.parse(path.join(targetDir,file));
				console.log(parseFile.name, '-', parseFile.ext.slice(1), '-', (fileStat.size/1024).toFixed(2),'Kb');
			}
		}
	}
	catch (err) {
		console.error(err);
	}
}
getFiles();