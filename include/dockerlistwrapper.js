'use strict';

const DockerWrapper = require('./dockerwrapper');

function runListContainer(me, opts, callback) {

    let docker = me.getInstance();

    docker.listContainers(opts, function(err, data) {
        if (err) {throw new Error(err.message)}
        callback(data);
    });
}

/**
 * Wrapper for the "docker list" command line
 */
class DockerListWrapper extends DockerWrapper {

    /**
     * Constructor
     * @param {Config} configGlobal
     */
    constructor(configGlobal) {
        super(configGlobal);
        this.connection = configGlobal.get('docker-host');
    };

    /**
     * Get all containers (including the stopped)
     * @param callback
     */
    getAll(callback) {
        runListContainer(this, {all:true}, callback);
    };

    /**
     * Get only the running containers
     * @param callback
     */
    getRunning(callback) {
        runListContainer(this, {all:false}, callback);
    };

    /**
     * Get a container based on the filter
     * @param {integer} limit The maximum number of results
     * @param {string} filters The filter '{"label": ["staging","env=green"]}'
     * @param callback
     */
    get(limit, filters, callback) {
        let opts = {"limit": limit, "filters": filters}
        docker.listContainers(opts, function(err, containers) {
            console.log(containers);
        });
    };
}


module.exports = DockerListWrapper;
