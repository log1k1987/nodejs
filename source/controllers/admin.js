const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const db = require('../models/1db')();
const uuidv4 = require('uuid/v4');

module.exports.getAdmin = function(req, res) {
  res.render('pages/admin', {
    msgfile: req.query.msgfile,
    msgskill: req.query.msgskill,
  });
};

module.exports.sendSkills = function(req, res) {
  db.set('Skills', [
    { number: req.body.age },
    { number: req.body.concerts },
    { number: req.body.cities },
    { number: req.body.years },
  ]);
  db.save();
  res.redirect('/admin/?msgskill=Данные успешно добавлены в базу');
};

module.exports.sendUpload = function(req, res, next) {
  let form = new formidable.IncomingForm();
  let upload = path.join('../public', 'upload');
  if (!fs.existsSync(upload)) {
    fs.mkdirSync(upload);
  }

  form.uploadDir = path.join(process.cwd(), upload);

  form.parse(req, function(err, fields, files) {
    if (err) {
      return next(err);
    }

    const valid = validation(fields, files);
    if (valid.err) {
      fs.unlinkSync(files.photo.path);
      return res.redirect(`/admin/?msgfile=${valid.status}`);
    }

    const fileName = path.join(upload, files.photo.name);

    fs.rename(files.photo.path, fileName, function(err) {
      if (err) {
        console.error(err.message);
        return;
      }

      let dir = fileName.substr(fileName.indexOf('\\upload'));

      db.set(`Product:${uuidv4()}`, {
        name: fields.name,
        path: dir,
        price: fields.price,
      });

      db.save();
      res.redirect('/admin/?msgfile=Картинка успешно загружена');
    });
  });
};

const validation = (fields, files) => {
  if (files.photo.name === '' || files.photo.size === 0) {
    return { status: 'Не загружена картинка!', err: true };
  }
  if (!fields.name) {
    return { status: 'Не указано описание картинки!', err: true };
  }
  return { status: 'Ok', err: false };
};
