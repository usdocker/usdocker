'use strict';

/**
 * Abstract class for implement docker wrapper class
 */
class DockerWrapper {

    /**
     * Constructor
     * @param {usdocker} usdocker
     */
    constructor(usdocker) {
        this.usdocker = usdocker;
        this.connection = usdocker.configGlobal().get('docker-host');
    }
}


module.exports = DockerWrapper;
