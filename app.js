const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// error handler
app.use(function(err, req, res, next) {
    // render the error page
    res.status(err.status || 500);
    res.render('error', { message: err.message, error: err });
});

const server = app.listen(process.env.PORT || 3000, function() {
    // eslint-disable-next-line no-console
    console.log('Сервер запущен на портy: ' + server.address().port);
});
