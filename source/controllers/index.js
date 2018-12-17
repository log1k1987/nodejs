const nodemailer = require('nodemailer');
const config = require('../config.json');
const db = require('../models/1db')();

module.exports.getIndex = function(req, res) {
  //console.log(db.get('Product'));
  const product = db.get('Product');
  const skill = db.get('Skills');
  //console.log(skill);
  res.render('pages/index', {
    products: product,
    skills: skill,
  });
  // eslint-disable-next-line no-console
  //res.end;
};

module.exports.sendData = function(req, res) {
  if (!req.body.name || !req.body.email || !req.body.message) {
    //если что-либо не указано - сообщаем об этом
    return res.json({ msg: 'Все поля нужно заполнить!', status: 'Error' });
  }
  //инициализируем модуль для отправки писем и указываем данные из конфига
  const transporter = nodemailer.createTransport(config.mail.smtp);
  const mailOptions = {
    from: `"${req.body.name}" <${req.body.email}>`,
    to: config.mail.smtp.auth.user,
    subject: config.mail.subject,
    text: req.body.message.trim().slice(0, 500) + `\n Отправлено с: <${req.body.email}>`,
  };
  //отправляем почту
  transporter.sendMail(mailOptions, function(error, info) {
    //если есть ошибки при отправке - сообщаем об этом
    if (error) {
      return res.json({
        msg: `При отправке письма произошла ошибка!: ${error}`,
        status: 'Error',
      });
    }
    res.json({ msgemail: 'Письмо успешно отправлено!', status: 'Ok' });
  });
};
