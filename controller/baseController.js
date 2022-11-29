const fs = require('fs');

class baseController {
    static readFile (path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf-8', (err, data) => {
                if (err) throw err;
                resolve(data);
            })
        })
    }
}

module.exports = baseController;
