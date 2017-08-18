'use strict';

const DockerWrapper = require('./dockerwrapper');
const DockerListWrapper = require('./dockerlistwrapper');
const util = require('util');

function pushArray(source, array, prefix) {
    for(let i=0; i<array.length; i++) {
        pushString(source, array[i], prefix);
    }
}

let hostConfigMapping = {
    'AutoRemove': {'cmdLine': '--rm', 'type': 'boolean'},
    'Binds': {'cmdLine': '-v', 'type': 'string'},
    'Links': {'cmdLine': '--link', 'type': 'string'},
    'CapAdd': {'cmdLine': '--cap-add', 'type': 'string'},
    'Ulimits': {'cmdLine': '--ulimit', 'type': 'string', 'format': '%Name%=%Soft%:%Hard%'}
};

function pushString(source, str, prefix) {
    if (str.toString().trim() !== '') {
        let parts = str.toString().match(/"[^"]+"\b|\S+/g);
        if (parts.length === 1) {
            if (prefix) {
                source.push(prefix);
            }
            source.push(parts[0].replace('\\s', ' '));
        } else {
            pushArray(source, parts);
        }
    }
}

function pushStringCond(source, cond, str, prefix) {
    if (cond) {
        pushString(source, str, prefix);
    }
}

function pushLinkContainer(configGlobal, source) {

    let dockerList = new DockerListWrapper(configGlobal);
    dockerList.getRunning(function (data) {
        for (let i=0; i<data.length; i++) {
            pushString(source, '--link ' + data[i].Names[0] + ':' + data[i].Names[0]);
        }
    });
}

/**
 * Wrapper for the "docker run" command line
 */
class DockerRunWrapper extends DockerWrapper {

    /**
     * Construtor
     * @param {Config} configGlobal
     */
    constructor(configGlobal) {
        super(configGlobal);
        this.hostConfig = {
            'AutoRemove': false,
            'Binds': [],
            'Links': []
        };
        this.ports = [];
        this.environment = [];
        this.detached = false;
        this.cmdParam = [];
        this.image = '';
        this.it = false;
        this.name = 'rename-container';
    }

    /**
     * Map the port. Equals to -p parameter
     * @param {int} host Port on host (if empty returns the string "host:container"
     * @param {int} container Port on container
     * @returns {Array|DockerRunWrapper}
     */
    port(host, container) {
        if (!host) {
            return this.ports;
        }
        this.ports.push(host + ':' + container);
        return this;
    }

    /**
     * Map the volume. Equals to -v parameter
     * @param {string} host Path on the host (if empty returns the string "host:container")
     * @param {string} container Path on container
     * @returns {Array|DockerRunWrapper}
     */
    volume(host, container) {
        if (!host) {
            return this.hostConfig.Binds;
        }
        this.hostConfig.Binds.push(host + ':' + container);
        return this;
    }

    /**
     * Create a link to an existing docker container. Equals to --link parameter
     * @param {string} source Container name
     * @param {string} target Link name
     * @returns {DockerRunWrapper}
     */
    link(source, target) {
        this.hostConfig.Links.push(source + ':' + target);
        return this;
    }

    /**
     * Set an environment variable on the container. Equals to --env parameter
     * @param {string} variable (if empty returns the string "variable=value")
     * @param {string} value
     * @returns {Array|DockerRunWrapper}
     */
    env(variable, value) {
        if (!variable) {
            return this.environment;
        }
        this.environment.push(variable + '=' + value);
        return this;
    }

    /**
     *
     * @param param
     * @returns {Array|DockerRunWrapper}
     */
    dockerParamSet(param, value) {
        if (!value) {
            return this.hostConfig[param];
        }
        this.hostConfig[param] = value;
        return this;
    }

    /**
     *
     * @param param
     * @returns {Array|DockerRunWrapper}
     */
    dockerParamAdd(param, value) {
        if (!value) {
            return this.hostConfig[param];
        }
        if (!this.hostConfig[param]) {
            this.hostConfig[param] = [];
        }

        if (!util.isArray(this.hostConfig[param])) {
            this.hostConfig[param] = [this.hostConfig[param]];
        }
        this.hostConfig[param].push(value);
        return this;
    }

    /**
     * Defines if the container will be detached. Equals to -d
     * @param {boolean} value (if empty returns true or false)
     * @returns {boolean|DockerRunWrapper}
     */
    isDetached(value) {
        if (value === undefined) {
            return this.detached;
        }
        if (this.it) {
            throw new Error('Cannot add -d parameter if -it or --rm is set');
        }
        this.detached = value;
        return this;
    }

    /**
     * Defines if the container will be a terminal interactive. Equals to -it parameter.
     * @param {boolean} value (if empty returns true or false)
     * @returns {boolean|DockerRunWrapper}
     */
    isInteractive(value) {
        if (value === undefined) {
            return this.it;
        }
        if (this.detached) {
            throw new Error('Cannot add -it parameter if daemon is set');
        }
        this.it = value;
        return this;
    }

    /**
     * Defines if the container removed on the end. Equals to --rm parameter.
     * @param {boolean} value (if empty returns true or false)
     * @returns {boolean|DockerRunWrapper}
     */
    isRemove(value) {
        if (value === undefined) {
            return this.hostConfig.AutoRemove;
        }
        this.hostConfig.AutoRemove = value;
        return this;
    }

    /**
     * Defines the container name. Equals to --name parameter.
     * @param {string} value (if empty returns the container name)
     * @returns {string|DockerRunWrapper}
     */
    containerName(value) {
        if (value === undefined) {
            return this.name;
        }
        this.name = value;
        return this;
    }

    /**
     * Defines the image name.
     * @param {string} value (if empty returns the image name)
     * @returns {string|DockerRunWrapper}
     */
    imageName(value) {
        if (value === undefined) {
            return this.image;
        }
        this.image = value;
        return this;
    }

    /**
     * Defines the command paramters.
     * @param {string} param (if empty returns the array of parameters)
     * @returns {Array|DockerRunWrapper}
     */
    commandParam(param) {
        if (param === undefined) {
            return this.cmdParam;
        }
        this.cmdParam.push(param.toString());
        return this;
    }

    /**
     * Return the full command line
     * @param {boolean} addLinks if true automatically add the links of running container to the script.
     * @returns {Array}
     */
    buildConsole(addLinks) {

        if (this.image === '') {
            throw new Error('Image cannot be empty');
        }

        let dockerCmd = [];

        pushString(dockerCmd,'-H ' + (!this.connection.match(/^(http|unix)/) ? 'unix://' : '') + this.connection);
        pushString(dockerCmd, 'run');
        pushString(dockerCmd, '--name ' + this.name);
        pushStringCond(dockerCmd, this.it, '-it');

        let localHostConfig = this.hostConfig;
        Object.keys(this.hostConfig).forEach(function (key) {
            if (hostConfigMapping[key]['type'] === 'boolean') {
                pushStringCond(dockerCmd, localHostConfig[key], hostConfigMapping[key]['cmdLine']);
                return;
            }
            if (hostConfigMapping[key]['type'] === 'string') {
                let values = localHostConfig[key];
                if (!util.isArray(values)) {
                    values = [values];
                }

                values.forEach(function (item) {
                    if (hostConfigMapping[key]['format']) {
                        let formattedItem = hostConfigMapping[key]['format'];
                        Object.keys(item).forEach(function (keyFormat) {
                            formattedItem = formattedItem.replace('%' + keyFormat + '%', item[keyFormat]);
                        });
                        item = formattedItem;
                    }
                    pushString(dockerCmd, hostConfigMapping[key]['cmdLine'] + ' ' + item);
                });
            }
        });

        if (addLinks === true) {
            pushLinkContainer(this.configGlobal, dockerCmd);
        }

        pushArray(dockerCmd, this.environment.map(function (value) {
            if (value.indexOf(' ') >= 0) {
                value = value.replace(' ', '\\s');
                value = value.replace('=', '="').replace(/$/, '"');
            }
            return value;
        }), '-e');
        pushArray(dockerCmd, this.ports, '-p');

        pushStringCond(dockerCmd, this.detached, '-d');

        pushString(dockerCmd, this.image);
        pushArray(dockerCmd, this.cmdParam);

        return dockerCmd;
    }

    /**
     * Returns the object to be used in the docker API.
     * @returns {Array}
     */
    buildApi() {

        let portsBindings = {};
        for(let i=0; i<this.ports.length; i++) {
            let ports = this.ports[i].split(':');
            portsBindings[ports[1] + '/tcp'] = [ { 'HostPort': ports[0].toString() } ];
        }

        let sendHostConfig = JSON.parse(JSON.stringify(this.hostConfig));
        sendHostConfig.PortBindings = portsBindings;

        return {
            name: this.name,
            AttachStdin: this.it,
            AttachStdout: true,
            AttachErr: true,
            Tty: !this.detached,
            OpenStdin: !this.detached,
            StdinOnce: false,
            Env: this.environment,
            HostConfig: sendHostConfig,
            Dns: ['8.8.8.8', '8.8.4.4'],
            Image: this.image,
            Cmd: this.cmdParam
        };
    }
}


module.exports = DockerRunWrapper;
