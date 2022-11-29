const http = require('http');
const url = require('url');
const Router = require('./controller/router.js');
const db = require('./model/database.js')

db.connect;

const server = http.createServer((req, res) => {
  let parseUrl = url.parse(req.url, true);
  let path = parseUrl.pathname;
  let trimPath = path.replace(/^\/+|\/$/g, '');
  console.log(trimPath);
  let handler = Router[trimPath] ? Router[trimPath] : Router.notFound;
  handler(req, res);
});

server.listen(8080, function () {
  console.log('server running at localhost:8080');
});