const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

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
const from = path.join(path.dirname(__filename), 'files');
const to = path.join(path.dirname(__filename), 'files-copy');

fs.rm(to, {maxRetries: 1, recursive: true}, (err) => {
    if (err && err.code !== 'ENOENT') {
        console.error('Не удалось удалить папку назначения: ', err.code);
    }
    else {
        copyDir(from, to);
    }
});
