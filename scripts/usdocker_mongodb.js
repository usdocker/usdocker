'use strict';

const Config = require('../include/config');
const DockerRunWrapper = require('../include/dockerrunwrapper');
const usdockerhelper = require('../include/usdockerhelper');
const showdocs = require('../include/showdocs');

const SCRIPTNAME = 'mongodb';

let config = new Config(SCRIPTNAME, '/tmp');

function getContainerDef() {
    let configGlobal = new Config(null, '/tmp');

    let docker = new DockerRunWrapper();
    return docker
        .containerName(SCRIPTNAME + configGlobal.get('container-suffix'))
        .port(config.get('port'), 27017)
        .volume(config.get('folder'), '/data/db')
        .env('TZ', configGlobal.get('timezone'))
        .isDetached(true)
        .isRemove(true)
        .imageName(config.get('image'))
    ;
}

module.exports = {
    setup: function()
    {
        config.setEmpty('image', 'mongo:3');
        config.setEmpty('folder', config.getDataDir());
        config.setEmpty('port', 27017);
    },

    debugcli() {
        console.log('docker ' + getContainerDef().buildConsole().join(' '));
    },

    debugapi() {
        console.log(getContainerDef().buildApi());
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

    help: function () {

        showdocs.getDocumentation(__dirname);
    },
};