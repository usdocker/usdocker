'use strict';

const Docker = require('dockerode');

/**
 * Abstract class for implement docker wrapper class
 */
class DockerWrapper {

    /**
     * Constructor
     * @param {Config} configGlobal
     */
    constructor(configGlobal) {
        this.configGlobal = configGlobal;
        this.connection = configGlobal.get('docker-host');
    };

    /**
     * Defines the docker host. Equals to -H parameter.
     * @param {string} hostName (if empty return the host name)
     * @returns {*}
     */
    host(hostName) {
        if (!hostName) {
            return this.connection;
        }
        this.connection = hostName;
        return this;
    };

    /**
     * Static method to return an instance of a DockerWrapper
     * @returns {Docker}
     */
    getInstance() {
        var opts = {};
        if (this.host().startsWith('http')) {
            var parts = this.host().match(/^(https?):\/\/(.*?):(\d+)/);
            opts.protocol = parts[1];
            opts.host = parts[2];
            opts.port = parts[3];
        } else {
            opts.socketPath = this.host();
        }
        return new Docker(opts);
    }

}


module.exports = DockerWrapper;
