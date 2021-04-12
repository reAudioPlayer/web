var http = require('http');

GITHUB
ONLINE

http.createServer(function (req, res) {
  res.writeHead(201, {'Content-Type': 'text/plain'});
  res.end('Hello World!');
}).listen(8080);
