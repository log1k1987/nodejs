const express = require('express');
const app = express();
const { resolve } = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(resolve(__dirname, 'dist')));

app.get('*', function(req, res) {
    res.sendFile(resolve(__dirname, 'dist/index.html'));
});

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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
