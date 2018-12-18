const Koa = require('koa');
const app = new Koa();
const static = require('koa-static');
const koaBody = require('koa-body');
const session = require('koa-session');
const config = require('./config/config.json');
const flash = require('koa-flash-simple');
const fs = require('fs');

app.use(koaBody());

const Pug = require('koa-pug');
const pug = new Pug({
    viewPath: './views',
    pretty: false,
    basedir: './views',
    noCache: true,
    app: app, // equals to pug.use(app) and app.use(pug.middleware)
});

const errorHandler = require('./libs/error');

app.use(static('./public'));

app.use(errorHandler);
app.on('error', (err, ctx) => {
    ctx.render('error', {
        status: ctx.response.status,
        error: ctx.response.message,
    });
});

const router = require('./routes');

app.use(flash());

app.use(session(config.session, app))
    .use(router.routes())
    .use(router.allowedMethods());

const server = app.listen(process.env.PORT || 3000, function() {
    // eslint-disable-next-line no-console
    console.log('Сервер запущен на портy: ' + server.address().port);
    if (!fs.existsSync(config.upload)) {
        fs.mkdirSync(config.upload);
    }
});
