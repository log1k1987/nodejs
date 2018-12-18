const Router = require('koa-router');
const router = new Router();
const koaBody = require('koa-body');

const ctrlHome = require('../controllers/index');
const ctrlLogin = require('../controllers/login');
const ctrlAdmin = require('../controllers/admin');

const isAdmin = async (ctx, next) => {
    // если в сессии текущего пользователя есть пометка о том, что он является
    // администратором
    if (ctx.session.isAdmin) {
        // то всё хорошо :)
        return next();
    }
    // если нет, то перебросить пользователя на главную страницу сайта
    ctx.redirect('/');
};

router.get('/', ctrlHome.getIndex);
router.post('/', ctrlHome.sendData);

router.get('/login', ctrlLogin.getLogin);
router.post('/login', ctrlLogin.auth);

router.get('/admin', isAdmin, ctrlAdmin.getAdmin);
router.post('/admin/skills', isAdmin, ctrlAdmin.sendSkills);
router.post(
    '/admin/upload',
    isAdmin,
    koaBody({
        multipart: true,
        formLimit: 1000000,
    }),
    ctrlAdmin.sendUpload
);
module.exports = router;
