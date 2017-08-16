'use strict';

const fs = require('fs');
const path = require('path');
const Config = require('./config');

let prefix = 'usdocker_';

/**
 * Handle where to locate and how to load and run the string
 */
class ScriptContainer {

    /**
     * Construtor
     * @param {Config} config
     * @param {string} search (optional)
     */
    constructor(config, search) {
        this._usdockerModules = {};
        this._configInstance = config;
        if (config === undefined || config === null) {
            this._configInstance = null;
        } else if (config.constructor.name !== 'Config') {
            throw new Error('Expected a Config instance - ' + config.constructor.name);
        }
        this._searchDir = search;
        if (search === undefined) {
            this._searchDir = [
                path.join(__dirname, '..', 'scripts'),
                path.join(__dirname, '..', '..'),
            ]
        }
    }

    /**
     * Check if the script container data is loaded
     * @returns {boolean}
     */
    isLoaded() {
        return (Object.keys(this._usdockerModules).length > 0);
    }

    /**
     * Load the string container data from the cache or create one if does not exists.
     * @param {boolean} force If force always will be recreate the cache.
     * @returns {true|false|null} True if it is created; False if it is loaded; null if get from cache.
     */
    load(force) {
        if (this.isLoaded() && force !== true) {
            return false;
        }

        if (!force && this._configInstance) {
            let result = this._configInstance.get('cachescripts');
            if (result !== undefined) {
                this._usdockerModules = result;
                return null;
            }
        }

        this._usdockerModules = {};
        for(let i=0; i<this._searchDir.length; i++) {
            this.loadModules(this._searchDir[i]);
        }

        if (this._configInstance) {
            this._configInstance.set('cachescripts', this._usdockerModules);
        }

        return true;
    }

    /**
     * Search for a module and create the instance.
     * @param item
     */
    loadModules(item) {
        let stat = fs.lstatSync(item);

        if (stat.isDirectory()) {
            // we have a directory: do a tree walk
            let files = fs.readdirSync(item);
            let f, l = files.length;
            for (let i = 0; i < l; i++) {
                f = path.join(item, files[i]);
                this.loadModules(f);
            }
        } else {
            if (path.extname(item) !== ".js") {
                return;
            }
            if (!path.basename(item).startsWith(prefix)) {
                return;
            }
            // we have a file: load it
            let script = path.basename(item, '.js').replace(prefix, '');

            if (!this._usdockerModules[script]) {
                let scriptOpts = {
                    'file': item,
                    'commands': Object.keys(require(item)).map(function (key) {
                        return key.replace(/([A-Z])/g, '-$1').toLowerCase()
                    })
                };
                this._usdockerModules[script] = scriptOpts;
            }

        }
    }

    /**
     * Check if the script exists
     * @param {string} script
     * @returns {boolean}
     */
    existsScript(script) {
        let scripts = this.availableScripts();
        return scripts.indexOf(script) >= 0;
    }

    /**
     * Return the list of available scripts
     * @returns {Array}
     */
    availableScripts() {
        if (!this.isLoaded()) {
            this.load()
        }

        return Object.keys(this._usdockerModules);
    }

    /**
     * Return the list of the available commands in the script;
     * @param {string} script
     * @returns {*}
     */
    availableCommands(script) {
        if (!this.isLoaded()) {
            this.load()
        }

        let item = this._usdockerModules[script]['commands'];

        return item;
    }

    /**
     * Load a script into the memory
     * @param {string} script
     * @returns {Object|*}
     */
    getScript(script) {
        if (!this.isLoaded()) {
            this.load()
        }

        let item = require(this._usdockerModules[script]['file']);

        return item;
    }

    /**
     * Convert a parameter 'name-second' into a camel case "nameSecond"
     * @param {string} name
     */
    cc(name) {
        function toCamelCase(match, offset, string) {
            return match.replace('-','').toUpperCase();
        }
        return name.replace(/\-[a-z]/g, toCamelCase);
    }
}

module.exports = ScriptContainer;
