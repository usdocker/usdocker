const DockerRunWrapper = require('../../include/dockerrunwrapper');
const Config = require('../../include/config');
const shell = require('shelljs');

let docker;
let configGlobal

beforeEach(() => {
    configGlobal = new Config(null, '/tmp');



    docker = new DockerRunWrapper(configGlobal);
});

afterEach(() => {
    shell.rm('-rf', '/tmp/.usdocker');
    shell.rm('-rf', '/tmp/.usdocker_data');
    docker = null;
    configGlobal = null
});

test('Test basic container creation', () => {
    let result = docker
        .containerName('mycontainer')
        .isDetached(true)
        .imageName('test/image')
        .buildConsole()
        .join(' ');
    expect(result).toBe('-H unix:///var/run/docker.sock run --name mycontainer -d test/image');

    let result2 = docker.buildApi();
    expect(result2).toEqual({
        "AttachErr": true,
        "AttachStdin": false,
        "AttachStdout": true,
        "Cmd": [],
        "Dns": ["8.8.8.8", "8.8.4.4"],
        "Env": [],
        "HostConfig": {
            "AutoRemove": false,
            "Binds": [],
            "Links": [],
            "PortBindings": {}
        },
        "Image": "test/image",
        "OpenStdin": false,
        "StdinOnce": false,
        "Tty": false,
        "name": "mycontainer"
    });
});

test('Test container creation with interactive mode', () => {
    let result = docker
        .containerName('mycontainer')
        .isInteractive(true)
        .isRemove(true)
        .imageName('test/image')
        .commandParam('bash')
        .buildConsole()
        .join(' ');
    expect(result).toBe('-H unix:///var/run/docker.sock run --name mycontainer -it --rm test/image bash');

    let result2 = docker.buildApi();
    expect(result2).toEqual({
        "AttachErr": true,
        "AttachStdin": true,
        "AttachStdout": true,
        "Cmd": ['bash'],
        "Dns": ["8.8.8.8", "8.8.4.4"],
        "Env": [],
        "HostConfig": {
            "AutoRemove": true,
            "Binds": [],
            "Links": [],
            "PortBindings": {}
        },
        "Image": "test/image",
        "OpenStdin": true,
        "StdinOnce": false,
        "Tty": true,
        "name": "mycontainer"
    });

});

test('Container creation with ports', () => {
    let result = docker
        .containerName('mycontainer')
        .port(3306, 3306)
        .port(80, 80)
        .isDetached(true)
        .imageName('test/image')
        .buildConsole()
        .join(' ');
    expect(result).toBe('-H unix:///var/run/docker.sock run --name mycontainer -p 3306:3306 -p 80:80 -d test/image');

    let result2 = docker.buildApi();
    expect(result2).toEqual({
        "AttachErr": true,
        "AttachStdin": false,
        "AttachStdout": true,
        "Cmd": [],
        "Dns": ["8.8.8.8", "8.8.4.4"],
        "Env": [],
        "HostConfig": {
            "AutoRemove": false,
            "Binds": [],
            "Links": [],
            "PortBindings": {"3306/tcp": [{"HostPort": "3306"}], "80/tcp": [{"HostPort": "80"}]}
        },
        "Image": "test/image",
        "OpenStdin": false,
        "StdinOnce": false,
        "Tty": false,
        "name": "mycontainer"
    });
});

test('Container creation volume', () => {
    let result = docker
        .containerName('mycontainer')
        .volume('/home/jg', '/srv/web')
        .volume('/etc/test', '/etc/test')
        .isDetached(true)
        .imageName('test/image')
        .buildConsole()
        .join(' ');
    expect(result).toBe('-H unix:///var/run/docker.sock run --name mycontainer -v /home/jg:/srv/web -v /etc/test:/etc/test -d test/image');

    let result2 = docker.buildApi();
    expect(result2).toEqual({
        "AttachErr": true,
        "AttachStdin": false,
        "AttachStdout": true,
        "Cmd": [],
        "Dns": ["8.8.8.8", "8.8.4.4"],
        "Env": [],
        "HostConfig": {
            "AutoRemove": false,
            "Binds": ['/home/jg:/srv/web', '/etc/test:/etc/test'],
            "Links": [],
            "PortBindings": {}
        },
        "Image": "test/image",
        "OpenStdin": false,
        "StdinOnce": false,
        "Tty": false,
        "name": "mycontainer"
    });
});

test('Container Links', () => {
    let result = docker
    .containerName('mycontainer')
    .link('mysql', 'mysql')
    .link('redis', 'redis')
    .isDetached(true)
    .imageName('test/image')
    .buildConsole()
    .join(' ');
    expect(result).toBe('-H unix:///var/run/docker.sock run --name mycontainer --link mysql:mysql --link redis:redis -d test/image');

    let result2 = docker.buildApi();
    expect(result2).toEqual({
        "AttachErr": true,
        "AttachStdin": false,
        "AttachStdout": true,
        "Cmd": [],
        "Dns": ["8.8.8.8", "8.8.4.4"],
        "Env": [],
        "HostConfig": {
            "AutoRemove": false,
            "Binds": [],
            "Links": ['mysql:mysql', 'redis:redis'],
            "PortBindings": {}
        },
        "Image": "test/image",
        "OpenStdin": false,
        "StdinOnce": false,
        "Tty": false,
        "name": "mycontainer"
    });
});

test('Container creation environment', () => {
    let result = docker
        .containerName('mycontainer')
        .env('TZ', 'America/Sao_Paulo')
        .env('APPLICATION_ENV', 'test')
        .isDetached(true)
        .imageName('test/image')
        .buildConsole()
        .join(' ');
    expect(result).toBe('-H unix:///var/run/docker.sock run --name mycontainer -e TZ=America/Sao_Paulo -e APPLICATION_ENV=test -d test/image');

    let result2 = docker.buildApi();
    expect(result2).toEqual({
        "AttachErr": true,
        "AttachStdin": false,
        "AttachStdout": true,
        "Cmd": [],
        "Dns": ["8.8.8.8", "8.8.4.4"],
        "Env": ['TZ=America/Sao_Paulo', 'APPLICATION_ENV=test'],
        "HostConfig": {
            "AutoRemove": false,
            "Binds": [],
            "Links": [],
            "PortBindings": {}
        },
        "Image": "test/image",
        "OpenStdin": false,
        "StdinOnce": false,
        "Tty": false,
        "name": "mycontainer"
    });
});

test('Container creation with extra-param', () => {
    let result = docker
        .containerName('mycontainer')
        .dockerParam('--ulimit memlock=-1:-1')
        .dockerParam('--cap-add=IPC_LOCK')
        .isDetached(true)
        .imageName('test/image')
        .buildConsole()
        .join(' ');
    expect(result).toBe('-H unix:///var/run/docker.sock run --name mycontainer --ulimit memlock=-1:-1 --cap-add=IPC_LOCK -d test/image');

    let result2 = docker.buildApi();
    expect(result2).toEqual({
        "AttachErr": true,
        "AttachStdin": false,
        "AttachStdout": true,
        "Cmd": [],
        "Dns": ["8.8.8.8", "8.8.4.4"],
        "Env": [],
        "HostConfig": {
            "AutoRemove": false,
            "Binds": [],
            "Links": [],
            "PortBindings": {}
        },
        "Image": "test/image",
        "OpenStdin": false,
        "StdinOnce": false,
        "Tty": false,
        "name": "mycontainer"
    });

});


test('Container creation with all togheter', () => {
    let result = docker
        .containerName('mycontainer')
        .port(3306, 3306)
        .port(80, 80)
        .volume('/home/jg', '/srv/web')
        .volume('/etc/test', '/etc/test')
        .env('TZ', 'America/Sao_Paulo')
        .env('APPLICATION_ENV', 'test')
        .link('mysql', 'mysql')
        .link('redis', 'redis')
        .dockerParam('--ulimit memlock=-1:-1')
        .dockerParam('--cap-add=IPC_LOCK')
        .isDetached(true)
        .imageName('test/image')
        .commandParam('bash')
        .commandParam('ls')
        .buildConsole()
        .join(' ');
    expect(result).toBe(
        '-H unix:///var/run/docker.sock '
        + 'run --name mycontainer --ulimit memlock=-1:-1 --cap-add=IPC_LOCK -e TZ=America/Sao_Paulo '
        + '-e APPLICATION_ENV=test -p 3306:3306 -p 80:80 -v /home/jg:/srv/web -v /etc/test:/etc/test '
        + '--link mysql:mysql --link redis:redis '
        + '-d test/image bash ls'
    );

    let result2 = docker.buildApi();
    expect(result2).toEqual({
        "AttachErr": true,
        "AttachStdin": false,
        "AttachStdout": true,
        "Cmd": ['bash', 'ls'],
        "Dns": ["8.8.8.8", "8.8.4.4"],
        "Env": ['TZ=America/Sao_Paulo', 'APPLICATION_ENV=test'],
        "HostConfig": {
            "AutoRemove": false,
            "Binds": ['/home/jg:/srv/web', '/etc/test:/etc/test'],
            "Links": ['mysql:mysql', 'redis:redis'],
            "PortBindings": {"3306/tcp": [{"HostPort": "3306"}], "80/tcp": [{"HostPort": "80"}]}
        },
        "Image": "test/image",
        "OpenStdin": false,
        "StdinOnce": false,
        "Tty": false,
        "name": "mycontainer"
    });
});

test('Have to fail with empty data', () => {
    expect(() => {
        docker.buildConsole();
    }).toThrow();
});

test('Error mixing detached and interactive', () => {
    expect(() => {
        docker.isDetached(true).isInteractive(true);
    }).toThrow();
});

test('Error mixing interactive and detached', () => {
    expect(() => {
        docker.isInteractive(true).isDetached(true);
    }).toThrow();
});

// test('run', () => {
//     console.log(docker.containerName('aaaa').isInteractive(true).isRemove(true).port(123,123).volume('/tmp', '/tmp').imageName('ubuntu:16.04').commandParam('bash').runConsole());
// });


// test('runApi', () => {
//     docker.containerName('aaaa').isInteractive(true).isRemove(true).port(123,123).volume('/tmp', '/tmp').imageName('ubuntu:16.04').commandParam('bash').runApi();
//
//     // docker.containerName('aaaa').isDetached(true).port(123,123).volume('/tmp', '/tmp').imageName('ubuntu:16.04').commandParam('bash').runApi();
//
// });
