const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const cssDir = path.join(path.dirname(__filename), 'styles');
const targetFile = path.join(path.dirname(__filename), 'project-dist', 'bundle.css');

async function createBundle()
{
    const stream = fs.createWriteStream(targetFile);
    try {
		const files = await fsp.readdir(cssDir);
		for (const file of files) {
            const cssFile = path.join(cssDir,file);
			const fileStat = await fsp.stat(cssFile);
			if (fileStat.isFile()) {
				const parseFile = path.parse(cssFile);
                if (parseFile.ext === '.css') {
                    const fileContent = await fsp.readFile(cssFile);
                    stream.write(fileContent + '\n');
                }
			}
		}
	}
	catch (err) {
		console.error(err);
        fs.unlink(targetFile);
	}
}
createBundle();