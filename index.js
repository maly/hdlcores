#!/usr/bin/env node

const confpath = require("./config.js");
//console.log(config)
const cores = require("./cores.js");
const cwd = process.cwd();
const colors = require("colors/safe");
//cores.forceUpdate();
//console.log(cores.getList())
const fs = require("fs");
const path = require("path");
const url = require("url");

const program = require("commander");

//rm recursive
const rimraf = (dirPath) => {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((entry) => {
      var entry_path = path.join(dirPath, entry);
      if (fs.lstatSync(entry_path).isDirectory()) {
        rimraf(entry_path);
      } else {
        fs.unlinkSync(entry_path);
      }
    });
    fs.rmdirSync(dirPath);
  }
};

const copyFileSync = (source, target) => {
  var targetFile = target;

  //if target is a directory a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
};

const copyFolderRecursiveSync = (source, target, nested) => {
  var files = [];
  //console.log("CP",source,target)
  //check if folder needs to be created or integrated
  //console.log("PP", target, path.basename( source ) )
  var targetFolder = target; //path.join( target, path.basename( source ) );
  if (nested) targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  //copy
  //console.log("S",source,fs.lstatSync( source ))
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file) {
      var curSource = path.join(source, file);
      //console.log("S",curSource, targetFolder)
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder, true);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
};

var pjson = require("./package.json");
program
  .version(pjson.version)
  .usage("cores command [options]")
  .on("--help", () => {
    console.log("See https://maly.github.io/asm80-node/ for further docs");
  });

program
  .command("install <core>")
  .description("Install a core")
  .alias("i")
  .action((core) => {
    var coreinfo = (core, cores.getCore(core));
    if (!coreinfo) {
      console.log(colors.red("Core '" + core + "' not found!"));
      return;
    }
    coreinfo = coreinfo[0];
    if (!coreinfo.dir) coreinfo.dir = "/";
    //console.log(coreinfo)
    var gitname = path.basename(url.parse(coreinfo.url).path);
    var corepath = confpath + "src/";
    if (fs.existsSync(corepath + gitname)) rimraf(corepath + gitname);
    if (!fs.existsSync(corepath)) fs.mkdirSync(corepath);
    var componentspath = cwd + "/cores/";
    if (!fs.existsSync(componentspath)) fs.mkdirSync(componentspath);
    var componentpath = componentspath + "" + coreinfo.name + "/";
    if (!fs.existsSync(componentpath)) fs.mkdirSync(componentpath);
    const simpleGit = require("simple-git")(corepath);

    simpleGit.clone(coreinfo.url, function () {
      copyFolderRecursiveSync(
        corepath + gitname + coreinfo.dir + "/",
        componentpath
      );
      console.log(colors.green("Core installed."));
    });
  });

program
  .command("remove <core>")
  .description("Uninstall a core")
  .alias("rm")
  .action(function (core) {
    console.log(core);
  });

program
  .command("update")
  .alias("u")
  .description("Update a core list")
  .action(function () {
    //console.log(cmd, core)
    cores.forceUpdate();
  });
program
  .command("list")
  .alias("l")
  .description("List of available cores")
  .action(function () {
    //console.log(cmd, core)
    console.log(colors.green("Available cores:"));
    console.log(
      colors.yellow(
        cores
          .getList()
          .map((f) => f.name)
          .sort()
          .join("\n")
      )
    );
  });

//  .command('u <core>','Uninstall a core')
//  .command('l','List available cores')

program.parse(process.argv);

if (!program.args.length) {
  program.help();
}
