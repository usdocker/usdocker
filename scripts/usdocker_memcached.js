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
    setup: function()
    {
        config.setEmpty('image', 'memcached:alpine');
        config.setEmpty('folder', config.getDataDir());
        config.setEmpty('port', 11211);
        config.setEmpty('memory', 1);
    },

    debugcli() {
        usdockerhelper.outputRaw('cli', getContainerDef());
    },

    debugapi() {
        usdockerhelper.outputRaw('api', getContainerDef());
    },

    up: function()
    {
        usdockerhelper.up(getContainerDef());
    },

    status: function() {
        usdockerhelper.status(SCRIPTNAME);
    },

    down: function()
    {
        usdockerhelper.down(SCRIPTNAME);
    },

    restart: function()
    {
        usdockerhelper.restart(SCRIPTNAME, getContainerDef());
    },

    help: function () {

        showdocs.getDocumentation(__dirname);
    },
};