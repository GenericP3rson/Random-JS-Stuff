const net = require('net');
const fs = require('fs');
let hasTask = false, time = false, getAns = false, mission, getFS = false, valid = false;
let tasks = {}, task;
net.createServer((soc) => {
    soc.write("Greetings, Ambassador. I am Captain Kirk of the USS Enterprise. We come in peace. Tell us what it is you would like, and we shall do it for you.\n");
    soc.write("We were sent here on a special mission by Starfleet Command. What was the mission?\n");
    hasTask = true;
    soc.on('data', (da) => {
        if (hasTask) {
            if (getAns) {
                if (da.toString().trim() == '0') {
                    soc.write(`Okay, deleting event...\nWhat would you like the Entreprise's mission to be? \n`);
                    getAns = false;
                } else {
                    hasTask = false;
                    getAns = false;
                    getFS = true;
                }
            } else if (time) {
                let q = da.toString().trim();
                tasks[task].time = q;
                soc.write(`Okay, Ambassador. We're scheduling this to the Entreprise: \n TASK: ${tasks[task].name} \n WHERE: ${tasks[task].time} \n Does this sound good? `);
                time = false;
                getAns = true;
            } else {
                soc.write("This is Lieutenant Uhura. Aye, aye, Ambassador. Where should we set course to? ");
                task = da.toString().trim();
                tasks[task] = {};
                tasks[task].name = task;
                time = true;
            }
        }
        if (getFS) {
            if (valid) {
                fs.readFile('Folder1.C11/' + da.toString().trim(), (err, data) =>{
                    if (err) {
                        soc.write(`I fear that ${da.toString().trim()} is not in our databases.\n`);
                        soc.write('Red Alert: Everyone please report to your cabins...\n');
                        soc.end();
                    }
                    soc.write(`Your document states...\n`);
                    soc.write(data);
                    soc.write("\n");
                    soc.write('Red Alert: Everyone please report to your cabins...\n');
                    soc.end();
                });
            } else {
                soc.write('What sorts of document do we require? ')
                valid = true;
            }
        }
    });
    soc.on('end', () => soc.write('Red Alert: Everyone please report to your cabins...'));
}).listen(8080);