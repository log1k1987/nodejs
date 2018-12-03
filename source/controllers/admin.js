const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const db = require('../models/db')();
//import uuidv4 from 'uuid/v4';
const uuidv4 = require('uuid/v4');

module.exports.getAdmin = function(req, res) {
  res.render('pages/admin', {
    msgfile: req.query.msgfile,
    msgskill: req.query.msgskill,
  });
};

module.exports.sendSkills = function(req, res) {
  console.log('SKILLS');
  console.log(req.body);

  db.set(`Skills:${uuidv4()}`, {
    age: req.body.age,
    concerts: req.body.concerts,
    cities: req.body.cities,
    years: req.body.years,
  });
  db.save();
  res.redirect('/admin/?msgskill=Данные успешно добавлены в базу');
};

module.exports.sendUpload = function(req, res, next) {
  let form = new formidable.IncomingForm();
  let upload = path.join('../public', 'upload');
  if (!fs.existsSync(upload)) {
    fs.mkdirSync(upload);
  }
  console.log(`dirname: ${__dirname}`);
  console.log(`cwd: ${process.cwd()}`);

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

      let dir = fileName.substr(fileName.indexOf('\\'));

      db.set(`Product:${fields.name}`, { path: dir, price: fields.price });
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
