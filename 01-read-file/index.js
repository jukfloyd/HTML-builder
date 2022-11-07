const fs = require('fs');
const path = require('path');
const targetFile = path.join(path.dirname(__filename), 'text.txt');
const stream = fs.createReadStream(targetFile, 'utf-8');
let out = '';
stream.on('data', _ => out += _);
stream.on('end', () => console.log(out));
stream.on('error', error => console.log('Ошибка чтения файла: ', error.message));