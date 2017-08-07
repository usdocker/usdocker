'use strict';

const Config = require('../include/config');
const DockerRunWrapper = require('../include/dockerrunwrapper');
const usdockerhelper = require('../include/usdockerhelper');
const showdocs = require('../include/showdocs');

const SCRIPTNAME = 'mysql';

let config = new Config(SCRIPTNAME, '/tmp/ustemp');
let configGlobal = new Config(null, '/tmp/ustemp');

function getContainerDef() {

    let docker = new DockerRunWrapper(configGlobal);
    return docker
        .containerName(SCRIPTNAME + configGlobal.get('container-suffix'))
        .port(config.get('port'), 3306)
        .volume(config.get('folder'), '/var/lib/mysql')
        .volume(config.getUserDir('conf.d'), '/etc/mysql/conf.d')
        .volume(config.getUserDir('home'), '/root')
        .env('MYSQL_ROOT_PASSWORD', config.get('rootPassword'))
        .env('TZ', configGlobal.get('timezone'))
        .isDetached(true)
        .isRemove(true)
        .imageName(config.get('image'))
    ;
}

module.exports = {
    setup: function(callback)
    {
        config.setEmpty('image', 'mysql:5.7');
        config.setEmpty('folder', config.getDataDir());
        config.setEmpty('port', 3306);
        config.setEmpty('rootPassword', 'password');

        config.copyToUserDir(__dirname + '/mysql/conf.d');
        config.copyToUserDir(__dirname + '/mysql/home');
        callback(null, 'setup ' + SCRIPTNAME);
    },

    client: function()
    {
        usdockerhelper.exec(SCRIPTNAME, ['mysql']);
    },

    connect: function()
    {
        usdockerhelper.exec(SCRIPTNAME, ['bash']);
    },

    dump: function()
    {
        usdockerhelper.exec(SCRIPTNAME, ['mysqldump']);
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

        showdocs.getDocumentation(__dirname);
    },
};