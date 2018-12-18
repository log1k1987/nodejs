const db = require('../models/db');
const psw = require('../libs/password');

module.exports.getLogin = async ctx => {
    ctx.render('pages/login');
};

module.exports.auth = async ctx => {
    const { email, password } = ctx.request.body;

    const user = db.getState().user;

    if (user.login === email && psw.validPassword(password)) {
        ctx.session.isAdmin = true;
        ctx.body = {
            mes: 'Done',
            status: 'OK',
        };
        ctx.redirect('/admin');
    } else {
        ctx.body = {
            mes: 'Forbiden',
            status: 'Error',
        };

        ctx.redirect('/');
    }
};
