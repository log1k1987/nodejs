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
    const { name, price } = ctx.request.body;
    const { name: fileName, size: fileSize, path: filePath } = ctx.request.files.photo;

    const valid = validation(name, price, fileName, fileSize);
    if (valid.err) {
        fs.unlinkSync(filePath);
        ctx.flash.set({ msgfile: valid.status });
        ctx.redirect('/admin');
    }

    let fileFullName = path.join(process.cwd(), 'public', 'upload', fileName);

    fs.rename(filePath, fileFullName, err => {
        if (err) {
            console.error(err.message);
            return;
        }
        db.set(`Product:${uuidv4()}`, {
            name: name,
            path: path.join('upload', fileName),
            price: price,
        });
        db.save();
    });
    ctx.flash.set({ msgfile: 'Картинка успешно загружена' });
    ctx.redirect('/admin');
};

const validation = (name, price, fileName, fileSize) => {
    if (fileName === '' || fileSize === 0) {
        return { status: 'Не загружена картинка!', err: true };
    }
    if (!name) {
        return { status: 'Не указано описание картинки!', err: true };
    }
    if (!price) {
        return { status: 'Не указано цена!', err: true };
    }
    return { status: 'Ok', err: false };
};
