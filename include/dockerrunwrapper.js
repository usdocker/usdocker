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



class DockerRunWrapper extends DockerWrapper {

    /**
     *
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

    port(host, container) {
        if (!host) {
            return this.ports;
        }
        this.ports.push(host + ":" + container);
        return this;
    };

    volume(host, container) {
        if (!host) {
            return this.volumes;
        }
        this.volumes.push(host + ':' + container);
        return this;
    };

    link(source, target) {
        this.links.push(source + ':' + target);
        return this;
    };

    env(variable, value) {
        if (!variable) {
            return this.environment;
        }
        this.environment.push(variable + "=" + value);
        return this;
    };

    dockerParam(param) {
        if (!param) {
            return this.params;
        }
        this.params.push(param);
        return this;
    };

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

    isRemove(value) {
        if (value === undefined) {
            return this.remove;
        }
        this.remove = value;
        return this;
    };

    containerName(value) {
        if (value === undefined) {
            return this.name;
        }
        this.name = value;
        return this;
    };

    imageName(value) {
        if (value === undefined) {
            return this.image;
        }
        this.image = value;
        return this;
    };

    commandParam(param) {
        if (param === undefined) {
            return this.cmdParam;
        }
        this.cmdParam.push(param.toString());
        return this;
    };

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
