'use strict';

const Docker = require('dockerode');
const Config = require('./config');

module.exports = {

    pull(image, callback) {
        let docker = new Docker();

        let instance = docker.getImage(image);
        instance.inspect(function (err, result) {
            if (!err) {
                callback();
                return;
            }

            docker.pull(image, function(err, stream) {
                if (err) {
                    console.log(err.message);
                    return;
                }

                docker.modem.followProgress(stream, onFinished, onProgress);

                function onFinished(err, output) {
                    if (err) {
                        console.log(err.message);
                        return;
                    }
                    callback();
                }

                function onProgress(event) {
                    console.log(event.id + ' ' +event.status + ' ' + event.progress);
                }
            });
        });
    },

    down(instance) {
        let docker = new Docker();
        let container = docker.getContainer(instance + '-container');
        container.stop(function (err, data) {
            if (err) {
                console.log(err.message);
            }
        });
    },

    status(instance) {
        let docker = new Docker();
        let container = docker.getContainer(instance + '-container');

        container.inspect(function(err, data) {
            if (err) {
                if (err.statusCode === 404) {
                    console.log(instance + ' is down');
                    return;
                }
            }

            console.log(instance + ' is ' + data.State.Status);
        });
    },

    /**
     *
     * @param {ScriptContainer} sc
     * @param {Config} script
     * @param {string} command
     * @param {boolean} setup
     */
    run(sc, script, command, setup) {
        if (!sc.existsScript(script)) {
            throw new Error('Script "' + script + '" does not exists');
        }

        if (setup){
            sc.getScript(script)['setup']();
        }

        sc.getScript(script)[command]();
    },

    getConfig(sc, script) {
        this.run(sc, script, 'setup', false);
        return new Config(script, '/tmp');
    }

};
