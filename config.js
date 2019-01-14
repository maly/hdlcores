const homedir = require('os').homedir();
const confpath = homedir+"/.cores/";
const fs = require("fs");
if (!fs.existsSync(confpath)) fs.mkdirSync(confpath);

module.exports = {
    path:confpath
}