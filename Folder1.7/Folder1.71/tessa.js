const h = require('http');
const fs = require('fs');
h.createServer((req, res) => {
    fs.readFile('tessa1.html', (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
    });
}).listen(1200, 'localhost');