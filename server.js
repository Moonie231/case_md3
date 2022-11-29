const http = require('http');
const url = require('url');
const Router = require('./controller/router.js');
const BaseController = require('./controller/baseController.js');
const db = require('./model/database.js');

db.connect;

const server = http.createServer( async (req, res) => {
  let parseUrl = url.parse(req.url, true);
  let path = parseUrl.pathname;
  let trimPath = path.replace(/^\/+|\/$/g, '');
  console.log(path);
  console.log(trimPath);
  let checkSession = await BaseController.checkSession(req);
  let loginRequest = ['login', 'login_submit', 'login_fail'];
  let tryLogIn = loginRequest.indexOf(trimPath) !== -1;
  if (checkSession || tryLogIn) {
    let handler = Router[trimPath] ? Router[trimPath] : Router.notFound;
    handler(req, res);
  } else {
    Router.login(req, res)}
});

server.listen(8080, function () {
  console.log('server running at localhost:8080');
});