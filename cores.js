const confpath = require("./config.js");
const fs = require("fs");
var request = require('request')
const colors = require("colors/safe")

const cores = confpath+"cores.json";

var getCoresFromGithub = function(cb) {

    return new Promise(function(resolve, reject) {
        // Do async job
        var options = { method: 'GET',
		    url: 'https://raw.githubusercontent.com/maly/cores/master/cores.json',
		    headers: { 
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                "Pragma": "no-cache",
                "Expires": "0",
                "Surrogate-Control": "no-store"
                },
		    json: true 
        }
    
	    request(options, function (error, response, body) {
            if (error) reject(error)
            else {
                console.log(colors.green("Cores list updated from master"))
                //console.log(JSON.stringify(body))
                resolve(body);
            }
		    //cb(out)
	    })

    })

	
}

if (!fs.existsSync(cores)) {
    getCoresFromGithub()
    .then((body) => fs.writeFileSync(cores,JSON.stringify(body)));
}

var getList = function() {
    return JSON.parse(fs.readFileSync(cores))
}

var getCore = function(core) {
    var c = JSON.parse(fs.readFileSync(cores));
    //console.log(c)
    return c.filter((f)=>(f.name===core))
}

module.exports = {
    forceUpdate:() => getCoresFromGithub().then((body) => fs.writeFileSync(cores,JSON.stringify(body))),
    getList:getList,
    getCore:getCore
}