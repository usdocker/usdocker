'use strict';

const Config = require('../include/config');
const DockerRunWrapper = require('../include/dockerrunwrapper');
const usdockerhelper = require('../include/usdockerhelper');
const showdocs = require('../include/showdocs');

const SCRIPTNAME = 'mysql';

let config = new Config(SCRIPTNAME, '/tmp');
let configGlobal = new Config(null, '/tmp');

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
    setup: function()
    {
        config.setEmpty('image', 'mysql:5.7');
        config.setEmpty('folder', config.getDataDir());
        config.setEmpty('port', 3306);
        config.setEmpty('rootPassword', 'password');

        config.copyToUserDir(__dirname + '/mysql/conf.d');
        config.copyToUserDir(__dirname + '/mysql/home');
    },

    debugcli() {
        console.log('docker ' + getContainerDef().buildConsole().join(' '));
    },

    debugapi() {
        console.log(getContainerDef().buildApi());
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