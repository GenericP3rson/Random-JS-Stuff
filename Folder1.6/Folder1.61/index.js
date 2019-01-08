const n = require("net");

n.createServer((s) => {
    s.write("Hi, there?");
// }).listen(8080);
}).listen(8080, "10.1.205.235");

// fs.readFile('demofile1.html', (err, data) => {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.write(data);
//     res.end();
// });