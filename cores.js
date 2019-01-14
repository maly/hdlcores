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
                },
		    json: true 
        }
    
	    request(options, function (error, response, body) {
            if (error) reject(error)
            else {
                console.log(colors.green("Cores list updated from master"))
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

module.exports = {
    forceUpdate:() => getCoresFromGithub().then((body) => fs.writeFileSync(cores,JSON.stringify(body))),
    getList:getList
}