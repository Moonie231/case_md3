const BaseController = require('./baseController.js');
const db = require('../model/database.js');
const qs = require('qs');
const url = require('url')

class Router extends BaseController {
    static login = async (req, res) => {
        let dataHTML = await this.readFile('./view/login.html');
        res.writeHead(200, 'Content-Type', 'text/html');
        res.write(dataHTML);
        res.end();
    }
    static login_submit = (req, res) => {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', async () => {
            let user = qs.parse(data);
            console.log(user);
            let checkUser = await db.checkUser(user.email, user.password);
            if (checkUser) {
                let now = Date.now();
                this.createSession(now, user.email, user.password);
                res.setHeader('Set-Cookie', `loginTime=${now}`);
                res.writeHead(301, { Location: './home' });
            }
            else {
                res.writeHead(301, { Location: './login_fail' });
            }
            res.end();
        });
    }
    static login_fail = async (req, res) => {
        let dataHTML = await this.readFile('./view/login.html');
        dataHTML = dataHTML.replace('<p class="text-danger"></p>', '<p class="text-danger">Incorrect email or password</p>');
        res.writeHead(200, 'Content-Type', 'text/html');
        res.write(dataHTML);
        res.end();
    }
    static home = async (req, res) => {
        let dataHTML = await this.readFile('./view/index.html');
        let roomHTML = '';
        let rooms = await db.getRooms();
        rooms.forEach((item) => {
            roomHTML +=
                `<tr>
                <td> ${item.rID} </td>
                <td> ${item.status} </td>
                <td> ${item.checkIn} </td>
                <td> ${item.checkOut} </td>
                <td>
                    <button type="button" class="btn btn-danger">
                        <a href="edit-room">
                            Edit
                        </a>
                    </button>
                    <button type="button" class="btn btn-danger">
                        <a href="delete?rID=${item.rID}&status=${item.status}">
                            Delete
                        </a>
                    </button>
                </td>
            </tr>`
        });
        res.writeHead(200, 'Content-Type', 'text/html');
        dataHTML = dataHTML.replace('<tbody></tbody>', roomHTML)
        res.write(dataHTML);
        res.end();
    }
    static notFound = (req, res) => {
        res.end('404 Not Found');
    }
    static logout = (req, res) => {
        let cookie = qs.parse(req.headers.cookie);
        let fileName = cookie.loginTime;
        this.deleteSession(fileName);
        res.writeHead(301, { Location: '/login' });
        res.end();
    }
    static delete = async (req, res) => {
        let data = url.parse(req.url).query;
        console.log(data);
        console.log(qs.parse(data));
        let rID = qs.parse(data).rID;
        let status = qs.parse(data).status;
        if (status) {
            db.deleteRoom(rID);
            res.writeHead(301, { Location: '/home' });
        }
    };
    static edit_info = async (req, res) => {
        let session = await this.getSessionData(req);
        let dataHTML = await this.readFile('./view/edit_info.html');
        let user = await db.getUser(session.email);
        console.log(user);
        let userHTML = `
            <tr>
                <td>Name</td>
                <td><input type="text" required name="name" value="${user.name}"></td>
            </tr>    
            <tr>
                <td>Birthday</td>
                <td><input type="date" required name="birthday" value=${this.formatDate(user.birthday)}></td>
            <tr>
                <td>Email</td>
                <td><input type="text" required value="${user.email}" disabled></td>
            </tr>
            <tr>
                <td>Telephone</td>
                <td><input type="text" required value="${user.telephone}"></td>
            </tr>        
            <tr>
                <td>Avatar</td>
                <td><input type="url" value="${user.avatar}"></td>
            </tr>
            <tr>
            <td colspan="2"><button type="submit">Save</button></td>
            </tr>`
        res.writeHead(200, 'Content-Type', 'text/html');
        dataHTML = dataHTML.replace('<tbody></tbody>', userHTML)
        res.write(dataHTML);
        res.end();
    }
    static edit_info_save = (req, res) => {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        })
    }
}

module.exports = Router;