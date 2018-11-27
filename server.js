const http = require('http');

//Переменные окружения
//require('dotenv').config(); npm i dotenv и создать файл .env с переменными или через scripts в package.json, предварительно установив кроссплатформенный пакет env с Npm(cross-env)

http.createServer((req, res) => {
    if (req.url === '/favicon.ico') {
        //res.writeHead(200, { 'Content-Type': 'image/x-icon' });
        res.end();
        console.log('favicon bb');
        return;
    }
    let showTimeUTC = setInterval(() => {
        console.log(new Date().getTime().toString());
    }, 1000);

    setTimeout(() => {
        clearInterval(showTimeUTC);
        res.end(new Date().getTime().toString());
    }, 5000);
}).listen(3000, '127.0.0.1', () => {
    console.log('Сервер начал прослушивание запросов');
});
