const confpath = require("./config.js");
const fs = require("fs");
const got = require("got");
const colors = require("colors/safe");

const cores = confpath + "cores.json";

const getCoresFromGithub = () => {
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
    };

    (async () => {
      try {
        const response = await got(options);
        console.log(colors.green("Cores list was updated from master"));
        resolve(JSON.parse(response.body));
      } catch (error) {
        console.log("error:", error);
        reject(error);
      }
    })();
  });
};

if (!fs.existsSync(cores)) {
  getCoresFromGithub().then((body) =>
    fs.writeFileSync(cores, JSON.stringify(body))
  );
}

const getList = () => {
  if (!fs.existsSync(cores)) {
    console.log(colors.red("No list. Perform `cores u` first."));
    return [];
  }
  return JSON.parse(fs.readFileSync(cores));
};

const getCore = (core) => {
  var c = JSON.parse(fs.readFileSync(cores));
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
