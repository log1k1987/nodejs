const fs = require('fs');
const path = require('path');
const params = process.argv.slice(2);
const startP = params[0];
const finishP = params[1];
const forOk = params[2];

const readDir = (base = './test_scr', endec = './test', level = 0, ok = false) => {
    const files = fs.readdirSync(base);
    console.log('Про ок ' + ok);
    files.forEach(item => {
        let localBase = path.join(base, item),
            state = fs.statSync(localBase),
            firstLetter = item.charAt(0);

        if (state.isDirectory()) {
            readDir(localBase, finishP, level + 1, forOk);
            //console.log('ПОСЛЕ  ВЫЗОВА!!!');
            // fs.rmdir(localBase, err => {
            //     if (err) {
            //         console.log(err);
            //         return;
            //     }
            //     console.log('Delete done!');
            // });
        } else {
            if (!fs.existsSync(path.join(endec, firstLetter))) {
                fs.mkdirSync(path.join(endec, firstLetter), { recursive: true });
            }

            fs.link(localBase, path.join(endec, firstLetter, item), err => {
                if (err) {
                    console.error(err.message);
                    return;
                }
                if (ok) {
                    fs.unlink(localBase, err => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                    });
                }
            });

            console.log('  '.repeat(level) + 'File: ' + item + ' Первый символ: ' + item.charAt(0));
        }
    });
    console.log(base);
};

readDir(startP, finishP, 0, forOk);
