'use strict';

const path = require('path');
const fs = require('fs');
const fsutil = require('./fsutil');
const moment = require('moment-timezone');
const requireUncached = require('require-uncached');

function copyConfig(source, dest) {
    if (fs.existsSync(path.join(dest, path.basename(source)))) {
        return true;
    }

    if (!fs.existsSync(source)) {
        throw new Error('Source path "' + source + '"does not exists');
    }

    fsutil.makeDirectory(dest);
    fsutil.copyFolderRecursiveSync(source, dest);
}

/**
 * Class to handle the configuration of the script
 */
class Config {

    /**
     * Constructor
     * @param {string} script The script
     * @param {string} alternateHome (optional) Setup an alternate home directory
     */
    constructor(script, alternateHome) {
        this.program = !global.program ? null : global.program;
        this._baseHome = alternateHome;
        this._script = script;
        this._configPath = null;
        this._configJson = null;
        this._configDataPath = null;
        this._nconf = null;
    }

    getConf() {
        if (!this._nconf) {
            this._nconf = requireUncached('nconf');
            this._nconf.use('file', { file: this.path() });
            this.reload();

            // Setting defaults for global
            if (!this.getScript()) {
                this.setEmpty('version', require('../package.json').version);
                this.setEmpty('container-suffix', '-container');
                this.setEmpty('timezone', this.getLocalTimeZone());
                this.setEmpty('docker-host', '/var/run/docker.sock');
                this.setEmpty('mappingDirFrom', '/mnt/c/');
                this.setEmpty('mappingDirTo', 'C:/');
            }
        }
        return this._nconf;
    }

    /**
     * Force reload from disk
     */
    reload() {
        this.getConf().load();
    }

    /**
     * Save configuration to disk
     */
    save() {
        this.getConf().save();
    }

    getScript() {
        return !this._script ? '' : this._script;
    }

    getConfigPath() {
        if (!this._configPath) {
            this._configPath = path.join(this.getUsdockerHome(), '.usdocker', 'setup', this.getScript());
            this._configJson = path.join(this._configPath, 'environment.json');
            fsutil.makeDirectory(this._configPath);
        }
        return this._configPath;
    }

    /**
     * Copy a folder from the script directory to the user directory
     * @param {string} source Path
     * @returns {boolean}
     */
    copyToUserDir(source) {
        return copyConfig(source, this.getConfigPath());
    }

    /**
     * Copy a folder from the script directory to the data directory
     * @param {string} source Path
     * @returns {boolean}
     */
    copyToDataDir(source) {
        return copyConfig(source, this.getDataDir());
    }

    getUsdockerHome() {
        if (!this._baseHome) {
            this._baseHome = process.cwd();
            if (this.program && this.program.home) {
                this._baseHome = this.program.home;
            } else if (process.env.USDOCKER_HOME) {
                this._baseHome = process.env.USDOCKER_HOME;
            }
        }
        return this._baseHome;
    }

    /**
     * Get the full path of the folder "name" in the user directory area
     * @param {string} name
     * @returns {string}
     */
    getUserDir(name) {
        return path.join(this.getConfigPath(), name ? name : '');
    }

    /**
     * Get the full path of the data directory
     * @returns {string}
     */
    getDataDir() {
        if (!this._configDataPath) {
            this._configDataPath = path.join(this._baseHome, '.usdocker', 'data', this.getScript());
            fsutil.makeDirectory(this._configDataPath);
        }
        return path.join(this._configDataPath);
    }

    /**
     * Set a key/value pair into the config and save to the disk
     * @param {string} key
     * @param {string|array} value
     */
    set(key, value) {
        this.getConf().set(key, value);
        this.save();
    }

    /**
     * Set a key/value pair into the config ONLY if does not exists and do nothing if exists.
     * @param {string} key
     * @param {string|array} value
     */
    setEmpty(key, value) {
        if (!this.get(key)) {
            this.set(key, value);
        }
    }

    /**
     * Get a value defined by the key or the value defined in defaultValue if not exists
     * @param {string} key
     * @param {string|array} defaultValue
     * @returns {*}
     */
    get(key, defaultValue) {
        let result = this.getConf().get(key);
        if (result === undefined) {
            return defaultValue;
        }
        return result;
    }

    /**
     * Remove a key
     * @param {string} key
     */
    clear(key) {
        this.getConf().clear(key);
        this.save();
    }

    /**
     * Dump the config
     */
    dump() {
        return fs.readFileSync(this.path()).toString();
    }

    /**
     * Get the time zone of the system
     * @returns {string}
     */
    getLocalTimeZone() {

        return moment.tz.guess();
    }

    path() {
        if (!this._configJson) {
            this.getConfigPath();
        }
        return this._configJson;
    }

}

module.exports = Config;


