'use strict';

const fs = require('fs');
const path = require('path');
const Config = require('./config');

let prefix = 'usdocker_';

class ScriptContainer {

    /**
     *
     * @param {Config} config
     * @param {string} search
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
     *
     * @returns {boolean}
     */
    isLoaded() {
        return (Object.keys(this._usdockerModules).length > 0);
    }

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
                    'commands': Object.keys(require(item))
                };
                this._usdockerModules[script] = scriptOpts;
            }

        }
    }

    existsScript(script) {
        let scripts = this.availableScripts();
        return scripts.indexOf(script) >= 0;
    }

    availableScripts() {
        if (!this.isLoaded()) {
            this.load()
        }

        return Object.keys(this._usdockerModules);
    }

    availableCommands(script) {
        if (!this.isLoaded()) {
            this.load()
        }

        let item = this._usdockerModules[script]['commands'];

        return item;
    }

    getScript(script) {
        if (!this.isLoaded()) {
            this.load()
        }

        let item = require(this._usdockerModules[script]['file']);

        return item;
    }

}

module.exports = ScriptContainer;
