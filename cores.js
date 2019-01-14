const confpath = require("./config.js");
const fs = require("fs");
var request = require('request')

const cores = confpath+"cores.json";

var getCoresFromGithub = function(cb) {

	var options = { method: 'GET',
		url: 'https://raw.githubusercontent.com/maly/cores/master/cores.json',
		headers: { 
        },

		json: true 

    }
    
	request(options, function (error, response, body) {
        if (error) throw new Error(error)
        fs.writeFileSync(cores,JSON.stringify(body))
		//cb(out)
	})
}

if (!fs.existsSync(cores)) {
    getCoresFromGithub()
}
