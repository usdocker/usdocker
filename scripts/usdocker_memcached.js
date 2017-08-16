'use strict';

const Config = require('../include/config');
const DockerRunWrapper = require('../include/dockerrunwrapper');
const usdockerhelper = require('../include/usdockerhelper');
const showdocs = require('../include/showdocs');

const SCRIPTNAME = 'memcached';

let config = new Config(SCRIPTNAME, '/tmp/ustemp');
let configGlobal = new Config(null, '/tmp/ustemp');

function getContainerDef() {

    let docker = new DockerRunWrapper(configGlobal);
    return docker
        .containerName(SCRIPTNAME + configGlobal.get('container-suffix'))
        .port(config.get('port'), 11211)
        .volume(config.get('folder'), '/data')
        .env('TZ', configGlobal.get('timezone'))
        .isDetached(true)
        .isRemove(true)
        .imageName(config.get('image'))
        .commandParam('memcached')
        .commandParam('-m')
        .commandParam(config.get('memory'))
    ;
}

module.exports = {
    setup: function(callback)
    {
        config.setEmpty('image', 'memcached:alpine');
        config.setEmpty('folder', config.getDataDir());
        config.setEmpty('port', 11211);
        config.setEmpty('memory', 1);
        callback(null, 'setup loaded for ' + SCRIPTNAME);
    },

    debugcli(callback) {
        let result = usdockerhelper.outputRaw('cli', getContainerDef());
        callback(result);
    },

    debugapi(callback) {
        let result = usdockerhelper.outputRaw('api', getContainerDef());
        callback(result);
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

        showdocs.getDocumentation(__dirname);
    },
};