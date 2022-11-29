const BaseController = require('./baseController.js');
const db = require('../model/database.js');
const qs = require('qs');

class Router extends BaseController {
    static login = async (req, res) => {
        if (req.method === 'GET') {
        let dataHTML = await this.readFile('./view/login.html')
        res.writeHead(200, 'Content-Type', 'text/html');
        res.write(dataHTML);
        }
        else {
            let data =''
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', () => {
                let user = qs.parse(data);
                let checkUser = db.checkUser(user.email, user.password);
                if (checkUser) {
                    console.log('redirect');
                    res.writeHead(301, {Location: './home'})
                };
            })
        }
        res.end();
    }
    static home = async (req, res) => {
        let dataHTML = await this.readFile('./view/index.html')
        res.writeHead(200, 'Content-Type', 'text/html');
        res.write(dataHTML);
        res.end();
    }
    static notFound = (req, res) => {
        res.end('404 Not Found');
    }
}

module.exports = Router;