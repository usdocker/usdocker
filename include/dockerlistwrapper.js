'use strict';

const DockerWrapper = require('./dockerwrapper');

function runListContainer(me, opts, callback) {

    let docker = me.getInstance();

    docker.listContainers(opts, function(err, data) {
        if (err) {throw new Error(err.message)}
        callback(data);
    });
}

class DockerListWrapper extends DockerWrapper {

    /**
     *
     * @param {Config} configGlobal
     */
    constructor(configGlobal) {
        super(configGlobal);
        this.connection = configGlobal.get('docker-host');
    };

    getAll(callback) {
        runListContainer(this, {all:true}, callback);
    };

    getRunning(callback) {
        runListContainer(this, {all:false}, callback);
    };

    get(limit, filters, callback) {
        let opts = {"limit": limit, "filters": filters}
        docker.listContainers(opts, function(err, containers) {
            console.log(containers);
        });
    };
}


module.exports = DockerListWrapper;
