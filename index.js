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
    console.log("\nSee https://github.com/maly/hdlcores/ for further docs");
  });

program
  .command("install <core>")
  .description("Install a core")
  .alias("i")
  .option("-v, --verbose", "Verbose logging")
  .action((core, cmd) => {
    var coreinfo = (core, cores.getCore(core));
    //console.log(cmd.verbose, coreinfo);
    if (!coreinfo || !coreinfo.length) {
      console.log(colors.red("Core '" + core + "' not found!"));
      return;
    }
    coreinfo = coreinfo[0];
    if (!coreinfo.dir) coreinfo.dir = "/";
    if (cmd.verbose) console.log(colors.cyan("Prepare cache"));
    var gitname = path.basename(url.parse(coreinfo.url).path);
    var corepath = confpath + "src/";
    if (fs.existsSync(corepath + gitname)) rimraf(corepath + gitname);
    if (!fs.existsSync(corepath)) fs.mkdirSync(corepath);
    var componentspath = cwd + "/cores/";
    if (!fs.existsSync(componentspath)) fs.mkdirSync(componentspath);
    var componentpath = componentspath + "" + coreinfo.name + "/";
    if (!fs.existsSync(componentpath)) fs.mkdirSync(componentpath);
    const simpleGit = require("simple-git")(corepath);
    if (cmd.verbose) console.log(colors.cyan("Cloning Git repository"));

    simpleGit.clone(coreinfo.url, () => {
      if (cmd.verbose) console.log(colors.cyan("Copying files"));
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
  .action((core) => {
    console.log(core);
  });

program
  .command("update")
  .alias("u")
  .description("Update a core list")
  .action(() => {
    //console.log(cmd, core)
    cores.forceUpdate();
  });
program
  .command("list [core]")
  .alias("l")
  .description("List of available cores")
  .action((core) => {
    if (core) {
      // perform core details
      let c = cores.getList().filter((f) => f.name == core);
      if (c && c.length == 1) {
        c = c[0];
        //console.log(c);
        console.log(
          colors.yellow(c.name),
          colors.green(c.title ? c.title : "(No description)")
        );
        if (c.description) console.log("Description:\t" + c.description);
        console.log("------------------------------------");
        if (c.license) console.log("License:\t" + c.license);
        console.log("Language:\t" + (c.lang ? c.lang : "VHDL"));
        console.log(colors.blue("URL:       \t" + c.url));
        return;
      }
      console.log(colors.red("No such core."));
    }
    console.log(colors.green("Available cores:"));
    console.log(
      colors.yellow(
        cores
          .getList()
          .map((f) => f.name)
          .sort()
          .join(", ")
      )
    );
  });

program
  .command("longlist")
  .alias("ll")
  .description("Verbose of available cores")
  .action(() => {
    console.log(colors.green("Available cores:"));
    console.log(
      colors.yellow(
        cores
          .getList()
          .map((f) => f.name + (f.title ? colors.white(" - " + f.title) : ""))
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
