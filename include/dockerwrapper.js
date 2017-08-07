'use strict';

const Docker = require('dockerode');

class DockerWrapper {

    /**
     *
     * @param {Config} configGlobal
     */
    constructor(configGlobal) {
        this.configGlobal = configGlobal;
        this.connection = configGlobal.get('docker-host');
    };

    host(hostName) {
        if (!hostName) {
            return this.connection;
        }
        this.connection = hostName;
        return this;
    };

    /**
     *
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
