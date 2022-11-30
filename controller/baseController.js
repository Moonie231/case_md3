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
            console.log('session created');
        })
    }
    static async checkSession(req) {
        let filePath = baseController.getSessionPath(req);
        if (await this.exists(filePath)) {
            let sessionString = await this.readFile(filePath);
            let session = JSON.parse(sessionString);
            let now = Date.now();
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
    static getCookie(req) {
        return qs.parse(req.headers.cookie);
    }
    static getSessionPath(req) {
        let cookie = this.getCookie(req);
        let loginTime = cookie.loginTime;
        let filePath = `./session/${loginTime}`;
        return filePath;
    }
    static async getSessionData(req) {
        let sessionPath = this.getSessionPath(req);
        let sessionString = await this.readFile(sessionPath);
        return JSON.parse(sessionString);
    }
    static formatDate(date) {
        let dateArray = date.toLocaleDateString().split('/');
        dateArray[0] = '0'.repeat(2 - dateArray[0].length) + dateArray[0];
        dateArray[1] = '0'.repeat(2 - dateArray[1].length) + dateArray[1];
        return `${dateArray[2]}-${dateArray[0]}-${dateArray[1]}`;
    }
    static parsePath(path) {
        let controllers = ['login', 'user', 'room'];
        let controller = controllers.filter(item => {
            return path.indexOf(item) !== -1;
        })[0];
        if (controller) {
            let action = controller.length == path.length ? 'default' : path.replace(`${controller}/`, '');
        return {'controller': controller, 'action': action};
        } else return {'controller': 'notFound', 'action': 'default'};
    }
}

module.exports = baseController;
