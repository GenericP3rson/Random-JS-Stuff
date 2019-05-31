const net = require("net");
const cli = net.connect({port: 8080}, () => console.log("HIIII2"));
cli.on('data', (data) => {
    console.log(data.toString());
    cli.end();
})
cli.on('end', () => console.log("THE WORLD HAS ENDED!!!"))