const fs = require('fs');
const path = require('path');
const targetFile = path.join(path.dirname(__filename), 'text.txt');
const stream = fs.createWriteStream(targetFile);

console.log('Введите текст для записи в файл text.txt:');

process.stdin.on('data', _ => {
    (_.toString().replace(/\r?\n|\r/gm, "") == 'exit') ? process.exit() : stream.write(_);
});
stream.on('error', error => console.log('Ошибка записи в файл: ', error.message));
process.on('SIGINT', () => process.exit());
process.on('exit', () => console.log('Спасибо и до свидания!'));