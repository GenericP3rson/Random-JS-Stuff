const h = require('http');
const fs = require('fs');
h.createServer((req, res) => {
  fs.readFile('two.html', (err, data) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
}).listen(8080, 'localhost');

// h.createServer((req, res) => {
//   fs.readFile('one.html', (err, data) => {
//     res.writeHead(200, { 'Content-Type': 'text/html' });
//     res.write(data);
//     res.end();
//   });
// }).listen(8080, 'localhost');

// h.createServer((req, res) => {
//   fs.readFile('one.html', (err, data) => {
//     res.writeHead(200, { 'Content-Type': 'text/html' });
//     res.write(data);
//     res.end();
//   });
// }).listen(3000, 'localhost');