const nodemailer = require('nodemailer');
const config = require('../config.json');
const db = require('../models/1db')();

module.exports.getIndex = async ctx => {
    const product = db.get('Product');
    const skill = db.get('Skills');

    ctx.render('pages/index', {
        products: product,
        skills: skill,
    });
};

module.exports.sendData = async ctx => {
    if (!ctx.request.body.name || !ctx.request.body.email || !ctx.request.body.message) {
        //если что-либо не указано - сообщаем об этом
        return (ctx.body = { msgemail: 'Все поля нужно заполнить!', status: 'Error' });
    }
    //инициализируем модуль для отправки писем и указываем данные из конфига
    try {
        const transporter = nodemailer.createTransport(config.mail.smtp);
        const mailOptions = {
            from: `"${ctx.request.body.name}" <${ctx.request.body.email}>`,
            to: config.mail.smtp.auth.user,
            subject: config.mail.subject,
            text: ctx.request.body.message.trim().slice(0, 500) + `\n Отправлено с: <${ctx.request.body.email}>`,
        };
        //отправляем почту
        await transporter.sendMail(mailOptions);
        return (ctx.body = { msgemail: 'Письмо успешно Отправлено!', status: '200' });
    } catch {
        return (ctx.body = { msgemail: 'Письмо успешно Сломалось!', status: 'Error' });
    }
};
