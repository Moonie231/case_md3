const BaseController = require('./baseController.js');
const db = require('../model/database.js');
const qs = require('qs');

class Router extends BaseController {
    static login = async(req, res) => {
        let data = await this.readFile('./view/login.html')
        res.writeHead(200, 'Content-Type', 'text/html');
        res.write(data);
        res.end;
    }
}

module.exports = Router;