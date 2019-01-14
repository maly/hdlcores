#!/usr/bin/env node

var config = require("./config.js");
//console.log(config)
var cores = require("./cores.js")
var cwd = process.cwd();
const colors = require("colors/safe")
//cores.forceUpdate();
//console.log(cores.getList())


var program = require('commander');

program.version('1.0.0')
  .usage('cores command [options]')
  .on('--help', function(){
    console.log('See https://maly.github.io/asm80-node/ for further docs');
  })

  program.command('install <core>')
  .description('Install a core')
  .alias('i')
  .action(function(core) {
      console.log(core)
  })

  program.command('remove <core>')
  .description('Uninstall a core')
  .alias("rm")
  .action(function(core) {
      console.log(core)
  })

  program.command('update')
  .alias("u")
  .description("Update a core list")
  .action(function() {
      //console.log(cmd, core)
      cores.forceUpdate();
  })
  program.command('list')
  .alias("l")
  .description("List of available cores")
  .action(function() {
      //console.log(cmd, core)
      console.log(colors.green("Available cores:"))
      console.log(colors.yellow(cores.getList().map((f)=>f.name).join("\n")))
  })

//  .command('u <core>','Uninstall a core')
//  .command('l','List available cores')


  program.parse(process.argv);


if (!program.args.length) {
  program.help();
}
