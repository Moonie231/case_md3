const BaseController = require('./baseController.js');
const UserModel = require('../model/userModel.js');
const qs = require('qs');

class Login extends BaseController {
    static view = async (req, res) => {
        if (req.method == "GET") {
            let dataHTML = await this.readFile('./view/login/login.html');
            res.writeHead(200, 'Content-Type', 'text/html');
            res.write(dataHTML);
            res.end();
        }
        else {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', async () => {
                let user = qs.parse(data);
                console.log(user);
                let checkUser = await UserModel.checkUser(user.email, user.password);
                if (checkUser) {
                    let now = Date.now().toString();
                    this.createSession(now, user.email, user.password);
                    res.setHeader('Set-Cookie', `loginTime=${now}`);
                    res.writeHead(301, { Location: '/room' });
                    res.end();
                }
                else {
                    res.writeHead(301, { Location: '/login/fail' });
                    res.end();
                }
            });
        }
    }

    static fail = async (req, res) => {
        let dataHTML = await this.readFile('./view/login/login.html');
        dataHTML = dataHTML.replace('<p class="text-danger"></p>', '<p class="text-danger">Incorrect email or password</p>');
        res.writeHead(200, 'Content-Type', 'text/html');
        res.write(dataHTML);
        res.end();
    }

}

module.exports = Login;