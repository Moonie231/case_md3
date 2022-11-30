const BaseController = require('./baseController.js');
const db = require('../model/database.js');
const qs = require('qs');
const url = require('url');
const navbar = require('../view/navbar.js');

class User extends BaseController {
    static logout = (req, res) => {
        let cookie = qs.parse(req.headers.cookie);
        let fileName = cookie.loginTime;
        this.deleteSession(fileName);
        res.writeHead(301, { Location: '/login' });
        res.end();
    }

    static 'edit-info' = async (req, res) => {
        let session = await this.getSessionData(req);
        let dataHTML = await this.readFile('./view/user/edit-info.html');
        let user = await db.getUser(session.email);
        console.log(user);
        dataHTML = dataHTML.replace('valueName', `value="${user.name}"`);
        dataHTML = dataHTML.replace('valueBirthDay', `value="${BaseController.formatDate(user.birthday)}"`);
        dataHTML = dataHTML.replace('valueEmail', `value="${user.email}"`);
        dataHTML = dataHTML.replace('valueTelephone', `value="${user.telephone}"`);
        dataHTML = dataHTML.replace('valueAvatar', `value="${user.avatar}"`);
        dataHTML = dataHTML.replace('<nav></nav>', navbar);
        res.writeHead(200, 'Content-Type', 'text/html');
        res.write(dataHTML);
        res.end();
    }

    static 'save-info' = (req, res) => {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            let user = qs.parse(data);
            console.log("info update");
            console.log(user);
            db.updateUserInfo(user.email, user.name, user.birthday, user.telephone, user.avatar);
        });
        console.log('info saved');
        res.writeHead(301, { Location: '/user/edit-info' });
        res.end();
    }

    static logout = (req, res) => {
        let cookie = qs.parse(req.headers.cookie);
        let fileName = cookie.loginTime;
        this.deleteSession(fileName);
        res.writeHead(301, { Location: '/login' });
        res.end();
    }

    static 'change-password' = async (req, res) => {
        let dataHTML = await this.readFile('./view/user/change-password.html');
        res.writeHead(200, 'Content-Type', 'text/html');
        res.write(dataHTML);
        res.end();
    }
    static 'save-password' = async (req, res) => {
        let data = '';
        let session = await this.getSessionData(req);
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            let password = qs.parse(data).password;
            let email = session.email;
            db.updateUserPassword(email, password);
            res.writeHead(301, { Location: '/room/home' });
            res.end();
        });
    }
}

module.exports = User;