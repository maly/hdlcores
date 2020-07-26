HDLCORES
========

A command-line utility for quick and easy installing and maintaining the proven VHDL (or Verilog) libraries (cores).

Installing core is as easy as `hdlcores i t80`.

## Installing hdlcores

Use npm, install as a global tool: `npm i -g hdlcores`


## Using hdlcores

### Updating the core list

`hdlcores u` - you have to do it before the first run, or when you want to update the list.

See [cores.json](cores.json) to check the list.

### List available cores

`hdlcores l` 

### Install a core

`hdlcores i [core-name]`, where _core-name_ is the name from the list (see above)

The code is downloaded and copied to the working directory (i.e. the directory where you invoke the commnad).