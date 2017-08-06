'use strict';

const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const moment = require('moment-timezone');
const requireNew = require('require-new');

class Config {

    constructor(script, alternateHome) {

        this.nconf = requireNew('nconf');
        
        if (alternateHome === undefined) {
            alternateHome = shell.config.HOME;
        }

        if (!script) {
            script = "";
        }
        this._configPath = path.join(alternateHome, '.usdocker', script);
        this._configDataPath = path.join(alternateHome, '.usdocker_data', script);
        this._configJson = path.join(this._configPath, 'environment.json')
        shell.mkdir('-p', this._configPath);
        shell.mkdir('-p', this._configDataPath);

        this.nconf.use('file', { file: this._configJson });
        this.reload();

        // Setting defaults for global
        if (script === "") {
            this.setEmpty('container-suffix', '-container');
            this.setEmpty('timezone', this.getLocalTimeZone());
            this.setEmpty('docker-host', '/var/run/docker.sock')
        }
    };

    reload() {
        this.nconf.load();
    };

    save() {
        this.nconf.save();
    }

    copyToUserDir(source) {

        if (shell.test('-e', path.join(this._configPath, path.basename(source)))) {
            return true;
        }

        if (!shell.test('-e', source)) {
            throw new Error('Source path "' + source + '"does not exists');
        }

        shell.cp('-R', source, this._configPath);
    };

    getUserDir(name) {
        return path.join(this._configPath, name);
    }

    getDataDir() {
        return path.join(this._configDataPath);
    }

    set(key, value) {
        this.nconf.set(key, value);
        this.save()
    };

    setEmpty(key, value) {
        if (!this.get(key)) {
            this.set(key, value);
        }
    }

    get(key, defaultValue) {
        let result = this.nconf.get(key);
        if (result === undefined) {
            return defaultValue;
        }
        return result;
    };

    clear(key) {
        this.nconf.clear(key);
        this.save();
    };

    dump() {
        return fs.readFileSync(this._configJson).toString();
    };

    getLocalTimeZone() {

        return moment.tz.guess();
    }

}

module.exports = Config;


