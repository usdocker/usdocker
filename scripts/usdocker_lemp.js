'use strict';

const Config = require('../include/config');
const DockerRunWrapper = require('../include/dockerrunwrapper');
const usdockerhelper = require('../include/usdockerhelper');
const showdocs = require('../include/showdocs');
const shell = require('shelljs');
const path = require('path');
const targz = require('targz');
const yesno = require('yesno');

const SCRIPTNAME = 'lemp';

let config = new Config(SCRIPTNAME, '/tmp/ustemp');
let configGlobal = new Config(null, '/tmp/ustemp');

function getContainerDef() {

    let docker = new DockerRunWrapper(configGlobal);
    return docker
        .containerName(SCRIPTNAME + configGlobal.get('container-suffix'))
        .port(config.get('port'), 80)
        .port(config.get('sslPort'), 443)
        .volume(config.get('folder') + '/data', '/srv/web')
        .volume(config.getUserDir('fpm') + '/fpmpool/zz-docker-2.conf', '/usr/local/etc/php-fpm.d/zz-docker-2.conf')
        .volume(config.getUserDir('fpm') + '/php/custom.ini', '/usr/local/etc/php/conf.d/custom.ini')
        .volume(config.getUserDir('nginx') + '/conf.d', '/etc/nginx/conf.d/')
        .env('LEMP_DATA_FOLDER', config.get('folder'))
        .env('LEMP_PORT', config.get('port'))
        .env('LEMP_SSL_PORT', config.get('sslPort'))
        .env('APPLICATION_ENV', config.get('applicationEnv'))
        .env('TZ', configGlobal.get('timezone'))
        .isDetached(true)
        .isRemove(true)
        .imageName(config.get('image'))
    ;
}

module.exports = {
    setup: function(callback)
    {
        config.setEmpty('image', 'byjg/php7-fpm-nginx:alpine');
        config.setEmpty('folder', config.getDataDir());
        config.setEmpty('port', 80);
        config.setEmpty('sslPort', 443);
        config.setEmpty('applicationEnv', 'dev');

        config.copyToUserDir(__dirname + '/lemp/conf/fpm');
        config.copyToUserDir(__dirname + '/lemp/conf/nginx');

        config.copyToDataDir(__dirname + '/lemp/data');

        callback(null, 'setup loaded for ' + SCRIPTNAME);
    },

    domainAdd(callback, extraArgs) {
        if (extraArgs.length !== 1 && extraArgs.length !== 2) {
            throw new Error('domain-add requires two parameters: domain and template (optional .tar.gz file)')
        }

        let destFolder = path.join(config.get('folder'), 'data', extraArgs[0]);
        if (shell.test('-e', destFolder)) {
            throw new Error('Domain "' + extraArgs[0] + '" already created');
        }

        if (extraArgs.length === 1) {
            let sourceFolder = path.join(config.get('folder'), 'data', '.template');
            shell.cp('-R', sourceFolder, destFolder);
            callback(null, 'Created domain "' + extraArgs[0] + '" from template');
        }

        if (extraArgs.length === 2) {
            targz.decompress({
                src: extraArgs[1],
                dest: destFolder
            }, function(err){
                if(err) {
                    callback(err);
                } else {
                    callback(null, 'Created domain "' + extraArgs[0] + '" from "' + extraArgs[1] + '"');
                }
            });
        }
    },

    domainDel(callback, extraArgs) {
        if (extraArgs.length !== 1) {
            throw new Error('domain-del requires one parameter: domain')
        }

        let destFolder = path.join(config.get('folder'), 'data', extraArgs[0]);
        if (!shell.test('-e', destFolder)) {
            throw new Error('Domain "' + extraArgs[0] + '" does not exists');
        }

        let fn = function(ok) {
            if(ok) {
                shell.rm('-rf', destFolder);
                callback(null, 'Domain removed!');
            } else {
                callback('Canceled!');
            }
            process.exit(0);
        };

        if (this.options.yes) {
            fn(true);
        } else if (this.options.no) {
            fn(false);
        } else {
            yesno.ask('Are you sure you want to continue (yes/no)?', false, fn);
        }
    },

    domainList(callback) {
        let destFolder = path.join(config.get('folder'), 'data');
        let result = shell.ls(destFolder).sort();

        callback(result.stdout.trim(), 'Domain list:\n - ' + result.stdout.trim().replace('\n', '\n - '));
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
