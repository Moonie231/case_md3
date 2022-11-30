const BaseController = require('./baseController.js');
const db = require('../model/database.js');
const qs = require('qs');
const url = require('url')
const LoginController = require('./loginController.js');
const RoomController = require('./roomController.js');
const UserController = require('./userController.js');
const NotFound = require('./notFound.js');

class Router extends BaseController {
    static login = LoginController;
    static room = RoomController;
    static user = UserController;
    static notFound = NotFound;
}

module.exports = Router;