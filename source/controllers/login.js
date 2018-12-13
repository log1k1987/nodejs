const db = require('../models/db');
const psw = require('../libs/password');

module.exports.getLogin = function(req, res) {
  res.render('pages/login', { title: 'login' });
};

module.exports.auth = function(req, res) {
  const { email, password } = req.body;
  // console.log(email);
  // console.log(password);

  const user = db.getState().user;

  if (user.login === email && psw.validPassword(password)) {
    req.session.isAdmin = true;
    req.body = {
      mes: 'Done',
      status: 'OK',
    };
    res.redirect('/admin');
  } else {
    req.body = {
      mes: 'Forbiden',
      status: 'Error',
    };

    res.redirect('/');
  }
};
