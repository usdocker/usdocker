'use strict';

const Docker = require('dockerode');
const DockerWrapper = require('./dockerwrapper');
const Config = require('./config');

function pushArray(source, array, prefix) {
    for(let i=0; i<array.length; i++) {
        pushString(source, array[i], prefix);
    }
}

function pushString(source, str, prefix) {
    if (str.toString().trim() !== "") {
        let parts = str.toString().match(/"[^"]+"\b|\S+/g);
        if (parts.length === 1) {
            if (prefix) {
                source.push(prefix);
            }
            source.push(parts[0]);
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

function pushLinkContainer(source) {

    const shell = require('shelljs');
    let result = shell.exec("docker ps", {silent: true}).split('\n');

    let iName = result[0].indexOf('NAMES');

    for (let i=1; i<result.length; i++) {
        if (iName > result[i].length) {
            continue;
        }
        pushString(source, "--link " + result[i].substring(iName).trim() + ":" + result[i].substring(iName).trim());
    }
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
        this.ports = [];
        this.volumes = [];
        this.environment = [];
        this.detached = false;
        this.params = [];
        this.links = [];
        this.cmdParam = [];
        this.image = "";
        this.it = false;
        this.remove = false;
        this.name = "rename-container";
    };

    /**
     * Map the port. Equals to -p parameter
     * @param {int} host Port on host (if empty returns the string "host:container"
     * @param {int} container Port on container
     * @returns {string}
     */
    port(host, container) {
        if (!host) {
            return this.ports;
        }
        this.ports.push(host + ":" + container);
        return this;
    };

    /**
     * Map the volume. Equals to -v parameter
     * @param {string} host Path on the host (if empty returns the string "host:container")
     * @param {string} container Path on container
     * @returns {*}
     */
    volume(host, container) {
        if (!host) {
            return this.volumes;
        }
        this.volumes.push(host + ':' + container);
        return this;
    };

    /**
     * Create a link to an existing docker container. Equals to --link parameter
     * @param {string} source Container name
     * @param {string} target Link name
     * @returns {DockerRunWrapper}
     */
    link(source, target) {
        this.links.push(source + ':' + target);
        return this;
    };

    /**
     * Set an environment variable on the container. Equals to --env parameter
     * @param {string} variable (if empty returns the string "variable=value")
     * @param {string} value
     * @returns {*}
     */
    env(variable, value) {
        if (!variable) {
            return this.environment;
        }
        this.environment.push(variable + "=" + value);
        return this;
    };

    /**
     *
     * @param param
     * @returns {*}
     */
    dockerParam(param) {
        if (!param) {
            return this.params;
        }
        this.params.push(param);
        return this;
    };

    /**
     * Defines if the container will be detached. Equals to -d
     * @param {boolean} value (if empty returns true or false)
     * @returns {*}
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
    };

    /**
     * Defines if the container will be a terminal interactive. Equals to -it parameter.
     * @param {boolean} value (if empty returns true or false)
     * @returns {*}
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
    };

    /**
     * Defines if the container removed on the end. Equals to --rm parameter.
     * @param {boolean} value (if empty returns true or false)
     * @returns {*}
     */
    isRemove(value) {
        if (value === undefined) {
            return this.remove;
        }
        this.remove = value;
        return this;
    };

    /**
     * Defines the container name. Equals to --name parameter.
     * @param {string} value (if empty returns the container name)
     * @returns {*}
     */
    containerName(value) {
        if (value === undefined) {
            return this.name;
        }
        this.name = value;
        return this;
    };

    /**
     * Defines the image name.
     * @param {string} value (if empty returns the image name)
     * @returns {*}
     */
    imageName(value) {
        if (value === undefined) {
            return this.image;
        }
        this.image = value;
        return this;
    };

    /**
     * Defines the command paramters.
     * @param {string} param (if empty returns the array of parameters)
     * @returns {*}
     */
    commandParam(param) {
        if (param === undefined) {
            return this.cmdParam;
        }
        this.cmdParam.push(param.toString());
        return this;
    };

    /**
     * Return the full command line
     * @param {boolean} addLinks if true automatically add the links of running container to the script.
     * @returns {Array}
     */
    buildConsole(addLinks) {

        if (this.image === "") {
            throw new Error('Image cannot be empty');
        }

        let dockerCmd = [];

        pushString(dockerCmd,'-H ' + (!this.connection.match(/^(http|unix)/) ? 'unix://' : '') + this.connection);
        pushString(dockerCmd, 'run');
        pushString(dockerCmd, '--name ' + this.name);
        pushStringCond(dockerCmd, this.it, '-it');
        pushStringCond(dockerCmd, this.remove, '--rm');

        if (addLinks === true) {
            pushLinkContainer(dockerCmd);
        }

        pushArray(dockerCmd, this.params);
        pushArray(dockerCmd, this.environment, '-e');
        pushArray(dockerCmd, this.ports, '-p');
        pushArray(dockerCmd, this.volumes, '-v');
        pushArray(dockerCmd, this.links, '--link');

        pushStringCond(dockerCmd, this.detached, '-d');

        pushString(dockerCmd, this.image);
        pushArray(dockerCmd, this.cmdParam);

        return dockerCmd;
    };

    /**
     * Returns the object to be used in the docker API.
     * @returns {Array}
     */
    buildApi() {

        let portsBindings = {};
        for(let i=0; i<this.ports.length; i++) {
            let ports = this.ports[i].split(':');
            portsBindings[ports[1] + "/tcp"] = [ { "HostPort": ports[0].toString() } ];
        }

        let dockerOptions = {
            name: this.name,
            AttachStdin: this.it,
            AttachStdout: true,
            AttachErr: true,
            Tty: !this.detached,
            OpenStdin: !this.detached,
            StdinOnce: false,
            Env: this.environment,
            HostConfig: {
                AutoRemove: this.remove,
                Binds: this.volumes,
                Links: this.links,
                PortBindings: portsBindings
            },
            Dns: ['8.8.8.8', '8.8.4.4'],
            Image: this.image,
            Cmd: this.cmdParam
        };

        return dockerOptions;
    };
}


module.exports = DockerRunWrapper;
