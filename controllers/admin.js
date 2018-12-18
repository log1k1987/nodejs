const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const db = require('../models/1db')();
const uuidv4 = require('uuid/v4');

module.exports.getAdmin = async ctx => {
    ctx.render('pages/admin', ctx.flash.get());
};

module.exports.sendSkills = async ctx => {
    db.set('Skills', [
        { number: ctx.request.body.age },
        { number: ctx.request.body.concerts },
        { number: ctx.request.body.cities },
        { number: ctx.request.body.years },
    ]);
    db.save();
    ctx.flash.set({ msgskill: 'Данные успешно добавлены в базу' });
    ctx.redirect('/admin');
};

module.exports.sendUpload = async ctx => {
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
            ctx.flash.set({ msgfile: valid.status });
            return ctx.redirect('/admin');
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
            ctx.flash.set({ msgfile: 'Данные успешно добавлены в базу' });
            return ctx.redirect('/admin');
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
