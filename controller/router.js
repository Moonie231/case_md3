const BaseController = require('./baseController.js');
const db = require('../model/database.js');
const qs = require('qs');
const ls = require('local-storage');
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
    static user = async (req, res) => {
        let dataHTML = await this.readFile('./view/user.html');
        let userHTML = '';
        let users = await db.getUser()
        users.forEach((item) =>{
            userHTML += `
            <tr>
                <td>Name</td>
                <td>${item.name}</td>
            </tr>    
            <tr>
                <td>Birthday</td>
                <td>${item.birthday}</td>
            <tr>
                <td>Email</td>
                <td>${item.email}</td>
            </tr>
            <tr>
                <td>Telephone</td>
                <td>${item.telephone}</td>
            </tr>        
            <tr>
                <td>Avatar</td>
                <td><img src="${item.avatar}"></td>
            </tr>`
        })
        res.writeHead(200, 'Content-Type', 'text/html');
        dataHTML = dataHTML.replace('{user}', userHTML)
        res.write(dataHTML);
        res.end();
    }
}

module.exports = Router;