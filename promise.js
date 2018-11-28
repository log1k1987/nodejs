const fs = require('fs');
const path = require('path');
const params = process.argv.slice(2);
const startP = params[0];
const finishP = params[1];
const forOk = params[2];

function readDir(base = './test_scr', endec = './test', level = 0) {
    return new Promise((resolve, reject) => {
        const files = fs.readdirSync(base);

        files.forEach(item => {
            let localBase = path.join(base, item),
                state = fs.statSync(localBase),
                firstLetter = item.charAt(0);

            if (state.isDirectory()) {
                readDir(localBase, finishP, level + 1);
            } else {
                if (!fs.existsSync(path.join(endec, firstLetter))) {
                    fs.mkdirSync(path.join(endec, firstLetter), { recursive: true });
                }

                fs.link(localBase, path.join(endec, firstLetter, item), err => {
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                });

                console.log('  '.repeat(level) + 'File: ' + item + ' Первый символ: ' + item.charAt(0));
            }
        });
        resolve();
    });
}

const deleteFolderRecursive = (base = './test_scr') => {
    return new Promise((resolve, reject) => {
        fs.readdirSync(base).forEach((file, index) => {
            let curPath = path.join(base, file);

            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(base);
        resolve();
        console.log('удалил');
    });
};

readDir(startP, finishP, 0)
    .then(files => {
        if (forOk) {
            return deleteFolderRecursive(startP);
        }
    })
    .then(files => {
        console.log('Готово');
    });

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason);
    process.exit(1);
});
