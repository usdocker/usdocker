'use strict';

const requireUncached = require('require-uncached');
const Docker = require('dockerode');
const DockerRunWrapper = require('./dockerrunwrapper');
const DockerListWrapper = require('./dockerlistwrapper');
const Config = requireUncached('./config');
const yesno = require('yesno');
const os = require('os');
const path = require('path');
const fs = require('fs');

let _configGlobal = null;

/**
 * Helper class to run docker commands/action
 * @module usdocker
 */

module.exports = {

    /**
     * Pull an docker image
     * @param {string} image The image name
     * @param callback The callback function
     * @example
     * usdocker.pull('ubuntu:16.04', function(err) {
     *     if (err) {
     *        console.log(err);
     *        return;
     *     }
     *     // Do if is OK
     * });
     */
    pull(image, callback) {
        let docker = this.getDockerInstance(this.configGlobal().get('docker-host'));

        let instance = docker.getImage(image);
        instance.inspect(function (err) {
            if (!err) {
                callback();
                return;
            }

            docker.pull(image, function(err, stream) {
                if (err) {
                    callback(err);
                    return;
                }

                docker.modem.followProgress(stream, onFinished, onProgress);

                function onFinished(err) {
                    if (err) {
                        callback(err);
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

    /**
     * Create and run a container based on the DockerRunWrapper parameter.
     * @param {string} instance
     * @param {DockerRunWrapper} dockerRunWrapper
     * @param callback
     * @example
     * let docker = usdocker.dockerRunWrapper(configGlobal);
     * docker.image('ubuntu:16.04').isInteractive(true).isDetached(false).commandParam('bash');
     * usdocker.up('ubuntu-container', docker, function(normal, verbose) {
     *    // do something
     * });
     */
    up(instance, dockerRunWrapper, callback) {
        let me = this;
        this.pull(dockerRunWrapper.imageName(), function () {
            // If there is no link argument, just run;
            if (!me.configGlobal().program.link) {
                me.runUsingApi(dockerRunWrapper, callback);
                return;
            }

            // The the instance link with the running components;
            dockerRunWrapper.linkRunning(function() {
                callback(null, 'started creation of instance ' + instance + '\nLinked with:\n - ' + dockerRunWrapper.link().join('\n - '));
                me.runUsingApi(dockerRunWrapper, callback);
            });
        });
    },

    /**
     * Shutdown a container defined by the name. The container suffix will be added automatically
     * @param {string} instance
     * @param callback
     * @example
     * usdocker.down('ubuntu-container', function(normal, verbose) {
     *    // do something
     * });
     */
    down(instance, callback) {
        let docker = this.getDockerInstance(this.configGlobal().get('docker-host'));
        let container = docker.getContainer(instance);
        container.inspect(function (err, data) {
            if (err) {
                callback(err);
                return;
            }

            if (!data.State.Running) {
                container.remove();
                callback(null, instance + ' was removed');
            } else {
                container.stop(function (err) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    callback(null, instance + ' was finished');
                });
            }
        });
    },

    /**
     * Return the RAW docker wrapper command.
     * @param {string} option Can be "api" to return the json for the docker API or CLI to return the document command.
     * @param dockerrunwrapper
     * @returns {*}
     */
    outputRaw(option, dockerrunwrapper) {
        if (option === 'api') {
            return dockerrunwrapper.buildApi();
        } else {
            return 'docker ' + dockerrunwrapper.buildConsole().join(' ');
        }
    },

    /**
     * Restart a container defined by the name. The container suffix will be added automatically
     * @param {string} instance
     * @param {DockerRunWrapper} dockerRunWrapper
     * @param callback
     * @example
     * let docker = usdocker.dockerRunWrapper(configGlobal);
     * docker.image('ubuntu:16.04').isInteractive(true).isDetached(false).commandParam('bash');
     * usdocker.down('ubuntu-container', docker, function(normal, verbose) {
     *    // do something
     * });
     */
    restart(instance, dockerRunWrapper, callback) {
        let me = this;
        this.down(instance, function (data, dataverb) {
            if (data instanceof Error) {
                callback(null, instance + ' was not started.');
            } else {
                callback(data, dataverb);
            }

            me.up(instance, dockerRunWrapper, callback);
        });
    },

    /**
     * Get the container running status. The container suffix will be added automatically
     * @param {string} instance
     * @param callback
     * @example
     * usdocker.status('ubuntu-container', function(normal, verbose) {
     *    // do something
     * });
     */
    status(instance, callback) {
        let docker = this.getDockerInstance(this.configGlobal().get('docker-host'));
        let container = docker.getContainer(instance);

        container.inspect(function(err, data) {
            if (err) {
                if (err.statusCode === 404) {
                    callback(instance + ' is down');
                    return;
                }
            }

            callback(instance + ' is ' + data.State.Status);
        });
    },

    /**
     * Run a method of the script.
     * @param {ScriptContainer} sc
     * @param {Config} script
     * @param {string} command
     * @param {boolean} setup
     */
    run(sc, script, command, setup, output, extraArgs, options) {
        if (!sc.existsScript(script)) {
            throw new Error('Script "' + script + '" does not exists');
        }

        if (setup){
            sc.getScript(script)['setup'](function(data, dataverb) {
                output.printErr(data);
                output.print(data, dataverb);
            });
        }

        let scriptInstance = sc.getScript(script);
        if (Object.keys(scriptInstance).indexOf(command) < 0) {
            throw new Error('Command "' + script + ' ' + command + '" does not exists.');
        }

        if (!options) {
            options = {};
        }

        scriptInstance.options = options;
        return scriptInstance[command](function(data, dataverb) {
            output.printErr(data);
            output.print(data, dataverb);
        }, extraArgs);
    },

    handleTerminal: function(err, stream, container, hasTerminal) {

        let previousKey,
            CTRL_P = '\u0010',
            CTRL_Q = '\u0011';

        // Resize tty
        function resize (container) {
            let dimensions = {
                h: process.stdout.rows,
                w: process.stderr.columns
            };

            if (dimensions.h !== 0 && dimensions.w !== 0) {
                container.resize(dimensions, function() {});
            }
        }

        // Exit container
        function exit (stream, isRaw) {
            process.stdout.removeListener('resize', resize);
            process.stdin.removeAllListeners();
            if (process.stdout.isTTY === true) {
                process.stdin.setRawMode(isRaw);
            }
            process.stdin.resume();
            stream.end();
            process.exit();
        }

        // Show outputs
        stream.pipe(process.stdout);

        // Connect stdin
        let isRaw = process.isRaw;
        process.stdin.resume();
        //process.stdin.setEncoding('utf8');
        if (process.stdout.isTTY === true) {
            process.stdin.setRawMode(isRaw);
        }
        process.stdin.pipe(stream);

        process.stdin.on('data', function(key) {
            // Detects it is detaching a running container
            if (previousKey === CTRL_P && key === CTRL_Q) exit(stream, isRaw);
            previousKey = key;
        });

        stream.on('end', function() {
            exit(stream, isRaw);
        });

        container.start(function() { /* callback uses (err, data) */
            resize(container);
            process.stdout.on('resize', function() {
                resize(container);
            });

            container.wait(function() { /* callback uses (err, data) */
                exit(stream, isRaw);
            });

            if (!hasTerminal) {
                exit(stream, isRaw);
            }
        });
    },

    /**
     * Run a container based on the DockerRunWrapper definition
     * @param {DockerRunWrapper} dockerrunwrapper
     */
    runUsingApi(dockerrunwrapper, callback) {

        let docker = this.getDockerInstance(dockerrunwrapper.usdocker.configGlobal().get('docker-host'));
        let optsc = dockerrunwrapper.buildApi();

        let me = this;

        docker.createContainer(optsc, function (err, container) {
            if (err) {
                callback(err);
                return;
            }

            let attach_opts = {stream: true, stdin: true, stdout: true, stderr: true};

            container.attach(attach_opts, function (err, stream) {
                me.handleTerminal(err, stream, container, dockerrunwrapper.isInteractive());
            });
        });
    },

    /**
     * Run a container based on the DockerRunWrapper definition
     * @param {DockerRunWrapper} dockerrunwrapper
     */
    runUsingCli(dockerrunwrapper, callback) {
        let dockerParams = dockerrunwrapper.buildConsole(true);

        const spawn = require('child_process').spawnSync;

        let options = {};
        if (dockerrunwrapper.isInteractive()) {
            options = {stdio: 'inherit'};
        }

        let docker = spawn('docker', dockerParams, options);

        // Show the proper result.
        if (!dockerrunwrapper.isInteractive()) {
            callback(docker.stdout.toString());

            if (docker.status > 0) {
                callback(new Error(docker.stderr.toString()));
            }
        } else {
            if (docker.status > 0) {
                callback('The command causes an unexpected error.');
                callback(null, 'docker ' + dockerParams.join(' '));
            }
        }
    },

    /**
     * Exec a container and attach a terminal
     * @param {string} instance
     * @param {Array} cmd
     * @param callback
     * @example
     * usdocker.exec('mysql-container', ['bash'], function(err) {
     *    if (err) console.log(err);
     *    // do something
     * });
     */
    exec(instance, cmd, callback) {
        let me = this;

        let docker = this.getDockerInstance(this.configGlobal().get('docker-host'));
        let container = docker.getContainer(instance);
        container.exec({Cmd: cmd, AttachStdin: true, AttachStdout: true, Tty: true, OpenStdin: true}, function (err, exec) {
            if (err) {
                callback(err);
                return;
            }

            exec.start( {stream: true, stdin: true, stdout: true, stderr: true}, function(err, stream) {
                me.handleTerminal(err, stream, container, true);
            });
        });
    },

    /**
     * Helper for ask a question
     * @param {string} question
     * @param {boolean} defaultValue
     * @param {boolean} optYes
     * @param {boolean} optNo
     * @param yesFn Callback for the result in case of success
     * @param noFn Callback for the result in case of success
     */
    ask(question, defaultValue, optYes, optNo, yesFn, noFn) {
        let fn = function(ok) {
            if(ok) {
                yesFn();
            } else {
                noFn('Canceled!');
            }
            process.exit(0);
        };

        if (optYes) {
            fn(true);
        } else if (optNo) {
            fn(false);
        } else {
            yesno.ask(question + ' (yes/no)?', defaultValue, fn);
        }
    },

    /**
     * Return a new Config object
     * @param script
     * @returns {Config}
     */
    config(script) {
        if (!script) {
            throw new Error('You need to pass the script');
        }
        return new Config(script);
    },

    /**
     * Return a new Config object with Global setup
     * @returns {Config}
     */
    configGlobal(usdockerHome) {
        if (!_configGlobal) {
            _configGlobal = new Config(null, usdockerHome);
        }
        return _configGlobal;
    },

    /**
     * Return a new DockerRunWrapper
     * @returns {DockerRunWrapper}
     */
    dockerRunWrapper() {
        return new DockerRunWrapper(this);
    },

    dockerListWrapper() {
        return new DockerListWrapper(this);
    },

    /**
     * Get an fsutil module
     * @returns {fsutil}
     */
    fsutil: function() {
        return require('./fsutil');
    },

    /**
     * Get the IPAddress on the host system.
     * @return {Array}
     */
    getHostIpAddress: function() {
        let ifaces = os.networkInterfaces();

        let ipAddress = [];

        Object.keys(ifaces).forEach(function (ifname) {
            let alias = 0;

            ifaces[ifname].forEach(function (iface) {
                if ('IPv4' !== iface.family || iface.internal !== false) {
                    // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                    return;
                }

                let aliasName = ifname;

                if (alias >= 1) {
                    // this single interface has multiple ipv4 addresses
                    aliasName += ':' + alias;
                }
                ++alias;

                ipAddress.push({'ifname': aliasName, 'address': iface.address});
            });
        });

        return ipAddress;
    },

    /**
     * Static method to return an instance of a DockerWrapper
     * @param {string} host
     * @returns {Docker}
     */
    getDockerInstance: function(host) {

        if (host === undefined) {
            host = '/var/run/docker.sock';
        }

        let opts = {};
        if (host.startsWith('http')) {
            let parts = host.match(/^(https?):\/\/(.*?):(\d+)/);
            opts.protocol = parts[1];
            opts.host = parts[2];
            opts.port = parts[3];
        } else if (host.startsWith('machine')) {
            let parts = host.match(/^(machine):\/\/(.*)/);
            if (!parts[2]) {
                throw new Error('Invalid machine definition ' + host);
            }
            parts[2] = path.resolve(parts[2]);
            if (!fs.existsSync(parts[2])) {
                throw new Error('There is no "' + parts[2] + '" docker-machine path');
            }
            let configJson = require(path.join(parts[2], 'config.json'));
            opts.host = configJson.Driver.IPAddress;
            opts.port = configJson.Driver.EnginePort;
            opts.ca = fs.readFileSync(configJson.HostOptions.AuthOptions.CaCertPath);
            opts.cert = fs.readFileSync(configJson.HostOptions.AuthOptions.ClientCertPath);
            opts.key = fs.readFileSync(configJson.HostOptions.AuthOptions.ClientKeyPath);
        } else {
            opts.socketPath = host;
        }

        return new Docker(opts);
    }
};
