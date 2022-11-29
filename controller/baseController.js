const fs = require('fs');
const qs = require('qs');

class baseController {
    static readFile(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf-8', (err, data) => {
                if (err) throw err;
                resolve(data);
            })
        })
    }
    static exists(filePath) {
        return new Promise((resolve, reject) => {
            fs.exists(filePath, result => {
                resolve(result);
            })
        })
    }
    static createSession(time, email, password) {
        let expire = 60 * 60 * 24 * 7 * 1000 + time;
        let session = {
            email: email,
            password: password,
            expire: expire
        }
        fs.writeFile(`./session/${time}`, JSON.stringify(session), 'utf-8', err => {
            if (err) throw err;
        })
    }
    static async checkSession(req) {
        let now = Date.now();
        let cookie = qs.parse(req.headers.cookie);
        let loginTime = cookie.loginTime;
        console.log(loginTime);
        let filePath = `./session/${loginTime}`;
        if (await this.exists(filePath)) {
            let sessionString = await this.readFile(filePath);
            let session = JSON.parse(sessionString);
            return session.expire >= now;
        }
        return false;
    }
    static deleteSession(fileName) {
        let filePath = `./session/${fileName}`;
        fs.unlink(filePath, err => {
            if (err) throw err;
            console.log('File deleted!');
            });
    }
}

module.exports = baseController;
