# Guide for create your own Useful Script

The useful scripts are a bunch of node.js projects with a several helpers
for aid you to control and run your docker instance

Follow the step by step to create a new USDocker script

## Create a project for your script

Create a regular node.js project. This project *must* have:

- npm install usdocker
- at least on file with the name started with "usdocker_" followed by the name of your script.
- This will a good practice create your project with "usdocker-" followed by the name of your script also.


## Using the Script Creator

The easiest way to start creating a new usdocker script is using the Script Creator. 

Just execute: 

```bash
usdocker-create-script -s myawesomescript -o /path/to/script
``` 

This will create a node project with all necessary informations to get ready a usdocker script. 

You just need to edit the file `usdocker_myawesomescript.js`

## Script Works

If you want to understand the whole process, read the documentation below:

### The script "usdocker_\<script\>.js"

USDocker will search recursively for all scripts prefixed 
with "usdocker_*" at your 'node_modules'.    

If the name of your script is "myawesome" you'll have to create a file called
`usdocker_myawesome.js`. 

The contents of your file is looking like to:


```javascript
'use strict';

const usdocker = require('usdocker');
//const path = require('path');

const SCRIPTNAME = 'myawesome';

let config = usdocker.config(SCRIPTNAME);
let configGlobal = usdocker.configGlobal();

function getContainerDef() {

    let docker = usdocker.dockerRunWrapper(configGlobal);
    return docker
        .containerName(SCRIPTNAME + configGlobal.get('container-suffix'))
        .port(config.get('port'), 0)                           // @todo change here
        .volume(config.get('folder'), '...................')   // @todo change here
        .env('TZ', configGlobal.get('timezone'))
        .isDetached(true)
        .isRemove(true)
        .imageName(config.get('image'))
    ;
}

module.exports = {
    setup: function(callback)
    {
        config.setEmpty('image', '.................');         // @todo change here
        config.setEmpty('folder', config.getDataDir());
        config.setEmpty('port', 0);                            // @todo change here

        //config.copyToUserDir(path.join(__dirname, 'myawesome', 'conf'));
        //config.copyToDataDir(path.join(__dirname, 'myawesome', 'data'));

        callback(null, 'setup loaded for ' + SCRIPTNAME);
    },

    debugcli(callback) {
        let result = usdocker.outputRaw('cli', getContainerDef());
        callback(result);
    },

    debugapi(callback) {
        let result = usdocker.outputRaw('api', getContainerDef());
        callback(result);
    },

    up: function(callback)
    {
        usdocker.up(SCRIPTNAME, getContainerDef(), callback);
    },

    status: function(callback) {
        usdocker.status(SCRIPTNAME, callback);
    },

    down: function(callback)
    {
        usdocker.down(SCRIPTNAME, callback);
    },

    restart: function(callback)
    {
        usdocker.restart(SCRIPTNAME, getContainerDef(), callback);
    }
};
```

Each method exported in this script will be available externally to usdocker.

For example will can call "usdocker myawesome up" and this will run the "up()" method.
So, you can add or remove method as you need.

The `callback` parameter have the syntax `function (normal, verbose) {}` and it is just for output the
result to the usdocker. This callback can process errors all well.  

### Planning your script

You have to planning some things of your script:

- What will be the default docker image?
- This script have some configuration file?


### Setup your script

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

### Creating the docker file definition

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

## Running your script locally before publish

You can run your script before publish it by point the usdocker directory to your script. 

To do this you have to:

```bash
usdocker --refresh /path/to/your/project
```

Now usdocker can access your project. 


## API Documentation

You can get more information about the API [here](api).
