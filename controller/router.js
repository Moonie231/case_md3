const BaseController = require('./baseController.js');
const db = require('../model/database.js');
const qs = require('qs');

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
            let checkUser = await db.checkUser(user.email, user.password);
            if (checkUser) {
                this.createSession(user.email, user.password);
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
        let rooms = await db.getRooms()
        console.log(typeof rooms)
        rooms.forEach((item) => {
            roomHTML += '<tr>'
            roomHTML += `<td> ${item.rID} </td>`
            roomHTML += `<td> ${item.status} </td>`
            roomHTML += `<td> ${item.checkIn} </td>`
            roomHTML += `<td> ${item.checkOut} </td>`
            roomHTML += '<td>'
            roomHTML += '<button type="button" class="btn btn-danger"><a href="edit-room">Edit</button>'
            roomHTML += '<button type="button" class="btn btn-danger"><a href="delete">Delete</button>'
            roomHTML += '</td>'
            roomHTML += '</tr>'
        });
        res.writeHead(200, 'Content-Type', 'text/html');
        dataHTML = dataHTML.replace('{room-list}', roomHTML)
        res.write(dataHTML);
        res.end();
    }
    static notFound = (req, res) => {
        res.end('404 Not Found');
    }
}

module.exports = Router;