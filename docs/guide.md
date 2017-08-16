# Guide for create your own Useful Script

The useful scripts are a bunch of node.js projects with a several helpers
for aid you to control and run your docker instance

Follow the step by step to create a new USDocker script

## Create a project for your script

Create a regular node.js project. This project *must* have:

- npm install usdocker
- at least on file with the name started with "usdocker_" followed by the name of your script.
- This will a good practice create your project with "usdocker_" followed by the name of your script also.


## Create your "usdocker_\<script\>.js"

USDocker will locate at your global directory all scripts named with "usdocker_*".   

If the name of your script will be "myawesome" you'll have to create a file called
`usdocker_myawesome.js`. 

The contents of your file will be:



```javascript
'use strict';

const Config = require('config');
const DockerRunWrapper = require('dockerrunwrapper');
const usdockerhelper = require('usdockerhelper');
const showdocs = require('showdocs');

const SCRIPTNAME = 'myawesome';  // <-- PUT HERE YOUR script name

let config = new Config(SCRIPTNAME);
let configGlobal = new Config(null);

function getContainerDef() {
    // Will see below
}

module.exports = {
    setup: function(callback)
    {
        // Will see below
    },

    client: function(callback)
    {
        usdockerhelper.exec(SCRIPTNAME, ['mysql'], callback);
    },

    connect: function(callback)
    {
        usdockerhelper.exec(SCRIPTNAME, ['bash'], callback);
    },

    dump: function(callback)
    {
        usdockerhelper.exec(SCRIPTNAME, ['mysqldump'], callback);
    },

    debugcli(callback) {
        let result = usdockerhelper.outputRaw('cli', getContainerDef());
        callback(result)
    },

    debugapi(callback) {
        let result = usdockerhelper.outputRaw('api', getContainerDef());
        callback(result)
    },

    up: function(callback)
    {
        usdockerhelper.up(SCRIPTNAME, getContainerDef(), callback);
    },

    status: function(callback) {
        usdockerhelper.status(SCRIPTNAME, callback);
    },

    down: function(callback)
    {
        usdockerhelper.down(SCRIPTNAME, callback);
    },

    restart: function(callback)
    {
        usdockerhelper.restart(SCRIPTNAME, getContainerDef(), callback);
    },

    help: function () {

        showdocs.getDocumentation(__dirname + "/docs");
    },
};
```

Each method exported in this script will be available externally to usdocker.

For example will can call "usdocker myawesome up" and this will run the "up()" method.

So, you can add or remove method as you need. 

## Planning your script

You have to planning some things of your script:

- What will be the default docker image?
- This script have some configuration file?


## Setup your script

The first thing to do is to create variables for customize your script.
This is good practice you setup at least "image" and "folder"

You'll use the `config` define in the code above. There are three important methods:

- config.setEmpty(key, value) - if "key" does not exists this will create a variable called "key" 
    with the value "value" or do nothing if exists;
- config.copyToUserDir(__diname + "/conf") - this will copy the template config to the directory
    $HOME/.usdocker/myawesome/confg.  

```javascript
setup: function(callback)
{
    config.setEmpty('image', 'myawesome:alpine');
    config.setEmpty('folder', config.getDataDir());
    config.setEmpty('port', 44444);

    config.copyToUserDir(__dirname + '/conf');
    callback(null, 'setup loaded for ' + SCRIPTNAME);
}
```

Explaining the setup:

1. Variable "image": define the docker image used in this script
2. Variable "folder": define the FOLDER where the system WILL PERSIST the data. 
    For example, a database will persist in this directory
3. Variable "port": A variable do define the port mapping between host and docker
4. copyToUserDir: will copy config files from this script to the local directory;
5. Call the routine for output information to the user. 

## Creating the docker file definition

Below an example of a docker run definition. It is important to note
that you have to use the config to make your script customizable. 

```javascript
function getContainerDef() {

    let docker = new DockerRunWrapper(configGlobal);
    return docker
        .containerName(SCRIPTNAME + configGlobal.get('container-suffix'))
        .port(config.get('port'), 44444)
        .volume(config.get('folder'), '/path/inside/docker')
        .volume(config.getUserDir('conf'), '/etc/path/conf')
        .env('TZ', configGlobal.get('timezone'))
        .isDetached(true)
        .isRemove(true)
        .imageName(config.get('image'))
    ;
}
```
