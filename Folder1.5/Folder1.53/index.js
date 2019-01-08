const h = require('http');
const fs = require('fs');
h.createServer((req, res) => {
  fs.readFile('one.html', (err, data) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
}).listen(8080);

// const h = require("http");
// const f = require("fs");

// h.createServer((req, res)=>{
//     f.readFile("one.html", (err, d)=>{
//         if (err) throw err;
//         res.writeHead(200, {'Content-Type': 'text/html'});
//         res.write(d);
//         res.end();
//     });
// }).listen(8080);