const fs = require('fs');
const ls = require('local-storage');

class baseController {
    static readFile (path) {
        return new Promise ((resolve, reject) => {
            fs.readFile(path, 'utf-8', (err, data) => {
                if (err) throw err;
                resolve(data);
            })
        })
    }
    static exists (filePath) {
        return new Promise ((resolve, reject) => {
            fs.exists(filePath, result => {
                resolve(result);
            })
        })
    }
    static createSession (email, password) {
        let loginTime = Date.now();
        ls.set('loginTime', loginTime);
        let expire = 60 * 60 * 24 * 7 * 1000 + loginTime;
        let session = {
            email: email,
            password: password,
            expire: expire
        }
        fs.writeFile(`./session/${loginTime}`, JSON.stringify(session), 'utf-8', err => {
            if (err) throw err;
        })
    }
    static async checkSession () {
        let now = Date.now();
        let loginTime = ls.get('loginTime');
        let filePath = `./session/${loginTime}`;
        if (await this.exists(filePath)) {
            let sessionString = await this.readFile(filePath);
            let session = JSON.parse(sessionString);
            return session.expire >= now;
        }
        console.log('session not available');
        return false;
    }
}

module.exports = baseController;
