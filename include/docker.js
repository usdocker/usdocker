'use strict';

function pushArray(source, array) {
    for(let i=0; i<array.length; i++) {
        pushString(source, array[i]);
    }
}

function pushString(source, str) {
    if (str.trim() !== "") {
        let parts = str.match(/"[^"]+"\b|\S+/g);
        if (parts.length === 1) {
            source.push(parts[0]);
        } else {
            pushArray(source, parts);
        }
    }
}

function pushStringCond(source, cond, str) {
    if (cond) {
        pushString(source, str);
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



class Docker {

    constructor() {
        this.ports = [];
        this.volumes = [];
        this.environment = [];
        this.daemon = false;
        this.params = [];
        this.cmdParam = [];
        this.image = "";
        this.it = false;
        this.remove = false;
        this.name = "rename-container";
    };

    port(host, container) {
        this.ports.push("-p " + host + ":" + container);
        return this;
    };

    volume(host, container) {
        this.volumes.push('-v ' + host + ':' + container);
        return this;
    };

    env(variable, value) {
        this.environment.push("-e " + variable + "=" + value);
        return this;
    };

    dockerParam(param) {
        this.params.push(param);
        return this;
    };

    isDaemon(value) {
        if (this.it || this.remove) {
            throw new Error('Cannot add -d parameter if -it or --rm is set');
        }
        this.daemon = value;
        return this;
    };

    isInteractive(value) {
        if (this.daemon) {
            throw new Error('Cannot add -it parameter if daemon is set');
        }
        this.it = value;
        return this;
    };

    isRemove(value) {
        if (this.daemon) {
            throw new Error('Cannot add --rm parameter if daemon is set');
        }
        this.remove = value;
        return this;
    };

    containerName(value) {
        this.name = value;
        return this;
    };

    imageName(value) {
        this.image = value;
        return this;
    };

    commandParam(param) {
        this.cmdParam.push(param);
        return this;
    };

    build(addLinks) {

        if (this.image === "") {
            throw new Error('Image cannot be empty');
        }

        let dockerCmd = [];

        pushString(dockerCmd, 'run');
        pushString(dockerCmd, '--name ' + this.name);
        pushStringCond(dockerCmd, this.it, '-it');
        pushStringCond(dockerCmd, this.remove, '--rm');

        if (addLinks === true) {
            pushLinkContainer(dockerCmd);
        }

        pushArray(dockerCmd, this.params);
        pushArray(dockerCmd, this.environment);
        pushArray(dockerCmd, this.ports);
        pushArray(dockerCmd, this.volumes);

        pushStringCond(dockerCmd, this.daemon, '-d');

        pushString(dockerCmd, this.image);
        pushArray(dockerCmd, this.cmdParam);

        return dockerCmd;
    };

    run() {
        let dockerParams = this.build(true);

        const spawn = require('child_process').spawnSync;

        let options = {};
        if (this.it) {
            options = {stdio: 'inherit'};
        }

        // const shell = require('shelljs');
        // shell.exec('docker ' + dockerParams.join(' '));

        let docker = spawn('docker', dockerParams, options);

        if (!this.it) {
            console.log(docker.stdout.toString());

            if (docker.status > 0) {
                console.log(docker.stderr.toString());
            }
        } else {
            if (docker.status > 0) {
                console.log('The command causes an unexpected error:');
                console.log('docker ' + dockerParams.join(' '))
            }
        }
    };
}


module.exports = Docker;
