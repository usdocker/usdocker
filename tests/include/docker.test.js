const DockerObject = require('../../include/docker');

let docker;

beforeEach(() => {
    docker = new DockerObject();
});

afterEach(() => {
    docker = null;
});

test('Test basic container creation', () => {
    let result = docker
        .containerName('mycontainer')
        .isDetached(true)
        .imageName('test/image')
        .buildConsole()
        .join(' ');
    expect(result).toBe('run --name mycontainer -d test/image');
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
    expect(result).toBe('run --name mycontainer -it --rm test/image bash');
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
    expect(result).toBe('run --name mycontainer -p 3306:3306 -p 80:80 -d test/image');
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
    expect(result).toBe('run --name mycontainer -v /home/jg:/srv/web -v /etc/test:/etc/test -d test/image');
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
    expect(result).toBe('run --name mycontainer -e TZ=America/Sao_Paulo -e APPLICATION_ENV=test -d test/image');
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
    expect(result).toBe('run --name mycontainer --ulimit memlock=-1:-1 --cap-add=IPC_LOCK -d test/image');
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
        .dockerParam('--ulimit memlock=-1:-1')
        .dockerParam('--cap-add=IPC_LOCK')
        .isDetached(true)
        .imageName('test/image')
        .buildConsole()
        .join(' ');
    expect(result).toBe(
        'run --name mycontainer --ulimit memlock=-1:-1 --cap-add=IPC_LOCK -e TZ=America/Sao_Paulo '
        + '-e APPLICATION_ENV=test -p 3306:3306 -p 80:80 -v /home/jg:/srv/web -v /etc/test:/etc/test '
        + '-d test/image'
    );
});

test('Have to fail with empty data', () => {
    expect(() => {
        docker.buildConsole();
    }).toThrow();
});

test('Error mixing detached and remove', () => {
    expect(() => {
        docker.isDetached(true).isRemove(true);
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

