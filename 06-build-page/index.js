const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const readline = require('readline');
const events = require('events');

const dirname = path.dirname(__filename);
const indexSourceFile = path.join(dirname, 'template.html');
const projectDir = path.join(dirname, 'project-dist');
const templDir = path.join(dirname, 'components');
const indexTargetFile = path.join(projectDir, 'index.html');

const cssDir = path.join(dirname, 'styles');
const targetCSSFile = path.join(projectDir, 'style.css');

const assetsSourceDir = path.join(dirname, 'assets');
const assetsTargetDir = path.join(projectDir, 'assets');

(async function makeProject() {
    try {
        await fsp.rm(projectDir, {force: true, recursive: true});
        await fsp.mkdir(projectDir);


		const files = await fsp.readdir(templDir);
        const templContent = {};
		for (const file of files) {
            const templFile = path.join(templDir,file);
			const fileStat = await fsp.stat(templFile);
			if (fileStat.isFile()) {
				const parseFile = path.parse(templFile);
                if (parseFile.ext === '.html') {
                    templContent['{{'+parseFile.name+'}}'] = await fsp.readFile(templFile);
                }
			}
		}
        const rl = readline.createInterface({
            input: fs.createReadStream(indexSourceFile),
            crlfDelay: Infinity
        });
      
        let outHtml = '';
        rl.on('line', (line) => {
            outHtml += line.replace(/({{[^}]+}})/g, (match) => templContent[match]) + '\r\n';
        });
        await events.once(rl, 'close');
        await fsp.writeFile(indexTargetFile, outHtml);

        const stream = fs.createWriteStream(targetCSSFile);
		const cssFiles = await fsp.readdir(cssDir);
		for (const file of cssFiles) {
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

        async function copyDir(from, to) {
            try {
                await fsp.mkdir(to, { recursive: true });
                const files = await fsp.readdir(from, {withFileTypes: true});
                for (const file of files) {
                    if (file.isFile()) {
                        await fsp.copyFile(path.join(from,file.name), path.join(to,file.name));
                    }
                    else if (file.isDirectory()) {
                        copyDir(path.join(from, file.name), path.join(to, file.name));
                    }
                }
        
            }
            catch (err) {
                console.error(err);
            }
        }
        await copyDir(assetsSourceDir, assetsTargetDir);
    }
    catch (err) {
        console.log(err);
    }
})();