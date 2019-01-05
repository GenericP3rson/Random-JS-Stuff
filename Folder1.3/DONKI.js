const req = require("request");
const tab = require("json-to-table");
let key = "PjWSE5ll6plyRFlYWJNC2lhBu16mMkViRAVcdJGI";
let link = "https://api.nasa.gov/neo/rest/v1/feed?start_date=2018-01-01&api_key=" + key;
req(link, { json: true}, (err, res, body) => {
    if (err) { 
        return console.log(err); 
    }
    // console.log(body);
    console.log(tab(body));
});