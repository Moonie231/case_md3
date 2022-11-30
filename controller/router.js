const BaseController = require('./baseController.js');
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