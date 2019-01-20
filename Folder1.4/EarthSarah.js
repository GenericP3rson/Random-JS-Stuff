const greenTalk = `
Hey, Captain. I created a copy of my work so we can mess around on this one. You should also add you code wherever.


`;
const req = require('request');
const fs = require("fs");
let q = 0;
let num = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let name = "123456789ABC".split("");
var GIFEncoder = require('gifencoder');
var encoder = new GIFEncoder(512, 512);
var pngFileStream = require('png-file-stream');
// var fs = require('fs');
let key = "PjWSE5ll6plyRFlYWJNC2lhBu16mMkViRAVcdJGI"; // My Key
let cloud = "False"; // Whether or not to show cloud percentage
let lat = "29.424122"; // Latitude
let lon = "-98.493629"; // Longitude
let year = "2015";
let place = "San_Antonio"; // Name of the location

for (var i = 1; i < 13; i++) {
    let month = "0" + i.toString();
    if (month.length > 2) {
        month = month.split("").splice(month.length-2, 2).join("");
    }
    let date = year + "-" + month + "-01"; // The Date
    let link2 = "https://api.nasa.gov/planetary/earth/assets?lon=" + lon + "&lat=" + lat + "&begin=" + year + "-" + month + "-01&end=" + year + "-" + month+ "-" + num[i-1] + "&api_key=" + key;
    // Sets the link to retrieve which day has data.
    req(link2, { json: true }, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        if (body.count == "0") {console.log("No results::" + link2);}
        else {
            date = body.results[0].date;
            // Will set the day to the first day with data
        };
    });
    let link = 'https://api.nasa.gov/planetary/earth/imagery/?lon='+ lon + '&lat=' + lat + '&date=' + date + '&cloud_score=' + cloud + '&api_key=' + key;
    // The link to get the actual photos.
    req(link, { json: true }, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        console.log(date, body.url);
        req.get({url: body.url, encoding: 'binary'}, function (err, response, body) {
            fs.writeFile("img" + name[q] + ".png", body, 'binary', function(err) {
                // Creates a png image from the link of the image.
                if (err) {console.log(err)}
                else {
                    console.log("File " + q + " was saved!"); q++;
                    if (q == 12) {
                        // When 12 images are created, creates a gif of those images
                        pngFileStream('img?.png')
                        .pipe(encoder.createWriteStream({ repeat: -1, delay: 500, quality: 10 }))
                        .pipe(fs.createWriteStream(place + '.gif'));
                        console.log("Gif Made! (Called " + place + ".gif)");
                    }
                }
            });
        });
    });
}
