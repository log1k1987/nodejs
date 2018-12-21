const { resolve } = require('path');

module.exports.getIndex = function(req, res) {
    //res.sendFile(path.join(__dirname, 'dist/index.html'));
    res.sendFile(resolve(__dirname, 'dist/index.html'));
};
