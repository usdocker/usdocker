'use strict';

const Config = require('../include/config');
const DockerRunWrapper = require('../include/dockerrunwrapper');
const usdockerhelper = require('../include/usdockerhelper');
const showdocs = require('../include/showdocs');
const shell = require('shelljs');
const fs = require('fs');

const SCRIPTNAME = 'wordpress';

let config = new Config(SCRIPTNAME, '/tmp/ustemp');
let configGlobal = new Config(null, '/tmp/ustemp');

function getContainerDef() {

    let docker = new DockerRunWrapper(configGlobal);
    return docker
        .containerName(SCRIPTNAME + configGlobal.get('container-suffix'))
        .port(config.get('port'), 80)
        .volume(config.get('folder'), '/data')
        .volume(config.get('pluginFolder'), '/var/www/html/wp-content/plugins')
        .volume(config.get('themesFolder'), '/var/www/html/wp-content/themes')
        .volume(config.get('uploadsFolder'), '/var/www/html/wp-content/uploads')
        .volume(config.get('languagesFolder'), '/var/www/html/wp-content/languages')
        .volume(config.getUserDir('conf'), '/usr/local/etc/php/conf.d/uploads.ini')
        .env('WORDPRESS_DB_HOST', config.get('db'))
        .env('WORDPRESS_DB_USER', config.get('dbUser'))
        .env('WORDPRESS_DB_PASSWORD', config.get('dbPassword'))
        .isDetached(true)
        .isRemove(true)
        .imageName(config.get('image'))
    ;
}

module.exports = {
    setup: function(callback)
    {
        config.setEmpty('image', 'wordpress:4.8-php7.1');
        config.setEmpty('folder', config.getDataDir());
        config.setEmpty('pluginFolder', config.getDataDir() + '/plugins');
        config.setEmpty('themesFolder', config.getDataDir() + '/themes');
        config.setEmpty('uploadsFolder', config.getDataDir() + '/uploads');
        config.setEmpty('languagesFolder', config.getDataDir() + '/languages');
        config.setEmpty('port', 8080);
        config.setEmpty('db', 'mysql' + configGlobal.get('container-suffix'));
        config.setEmpty('dbUser', 'root');
        config.setEmpty('dbPassword', 'password');

        config.copyToUserDir(__dirname + '/wordpress/conf');

        let folderList = [
            config.get('folder'),
            config.get('pluginFolder'),
            config.get('themesFolder'),
            config.get('uploadsFolder'),
            config.get('languagesFolder')
        ];

        for (let i=0; i<folderList.length; i++) {
            if (!fs.existsSync(folderList[i])) {
                shell.mkdir('-p', folderList[i]);
                // fs.chownSync(folderList[i], 33, 33);
            }
        }
        callback(null, 'setup ' + SCRIPTNAME);
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
