const confpath = require("./config.js");
const fs = require("fs");
//var request = require("request");
const got = require("got");
const colors = require("colors/safe");

const cores = confpath + "cores.json";

var getCoresFromGithub = function (cb) {
  return new Promise(function (resolve, reject) {
    // Do async job
    var options = {
      method: "GET",
      url: "https://raw.githubusercontent.com/maly/cores/master/cores.json",
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
      },
      //json: true,
    };

    (async () => {
      try {
        const response = await got(options);
        //console.log("statusCode:", response.statusCode);
        //console.log("body:", response.body);
        console.log(colors.green("Cores list was updated from master"));
        resolve(JSON.parse(response.body));
      } catch (error) {
        console.log("error:", error);
        reject(error);
      }
    })();
    /*
    request(options, function (error, response, body) {
      if (error) reject(error);
      else {
        console.log(colors.green("Cores list updated from master"));
        //console.log(JSON.stringify(body))
        resolve(body);
      }
      //cb(out)
    });
      */
  });
};

if (!fs.existsSync(cores)) {
  getCoresFromGithub().then((body) =>
    fs.writeFileSync(cores, JSON.stringify(body))
  );
}

var getList = function () {
  if (!fs.existsSync(cores)) {
    console.log(colors.red("No list. Perform `cores u` first."));
    return [];
  }
  return JSON.parse(fs.readFileSync(cores));
};

var getCore = function (core) {
  var c = JSON.parse(fs.readFileSync(cores));
  //console.log(c)
  return c.filter((f) => f.name === core);
};

module.exports = {
  forceUpdate: () =>
    getCoresFromGithub().then((body) =>
      fs.writeFileSync(cores, JSON.stringify(body))
    ),
  getList: getList,
  getCore: getCore,
};
