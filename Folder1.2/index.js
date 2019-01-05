const fs = require("fs");

fs.readFile('words.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
}, 8080);