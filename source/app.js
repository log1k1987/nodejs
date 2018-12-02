const express = require('express');
const path = require('path');
const app = express();
// const bodyParser = require('body-parser');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '../public')));

app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found Piska');
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