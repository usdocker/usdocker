const DockerObject = require('../../include/docker');

let docker;

beforeEach(() => {
    docker = new DockerObject();
});

afterEach(() => {
    docker = null;
});

test('docker test 1', () => {
    let result = docker
        .containerName('mycontainer')
        .isDaemon(true)
        .imageName('test/image')
        .build()
        .join(' ');
    expect(result).toBe('run --name mycontainer -d test/image');
});

test('docker test 2', () => {
    let result = docker
        .containerName('mycontainer')
        .isInteractive(true)
        .isRemove(true)
        .imageName('test/image')
        .commandParam('bash')
        .build()
        .join(' ');
    expect(result).toBe('run --name mycontainer -it --rm test/image bash');
});

test('docker test 3', () => {
    let result = docker
        .containerName('mycontainer')
        .port(3306, 3306)
        .port(80, 80)
        .isDaemon(true)
        .imageName('test/image')
        .build()
        .join(' ');
    expect(result).toBe('run --name mycontainer -p 3306:3306 -p 80:80 -d test/image');
});

test('docker test 4', () => {
    let result = docker
        .containerName('mycontainer')
        .volume('/home/jg', '/srv/web')
        .volume('/etc/test', '/etc/test')
        .isDaemon(true)
        .imageName('test/image')
        .build()
        .join(' ');
    expect(result).toBe('run --name mycontainer -v /home/jg:/srv/web -v /etc/test:/etc/test -d test/image');
});

test('docker test 5', () => {
    let result = docker
        .containerName('mycontainer')
        .env('TZ', 'America/Sao_Paulo')
        .env('APPLICATION_ENV', 'test')
        .isDaemon(true)
        .imageName('test/image')
        .build()
        .join(' ');
    expect(result).toBe('run --name mycontainer -e TZ=America/Sao_Paulo -e APPLICATION_ENV=test -d test/image');
});

test('docker test 6', () => {
    let result = docker
        .containerName('mycontainer')
        .dockerParam('--ulimit memlock=-1:-1')
        .dockerParam('--cap-add=IPC_LOCK')
        .isDaemon(true)
        .imageName('test/image')
        .build()
        .join(' ');
    expect(result).toBe('run --name mycontainer --ulimit memlock=-1:-1 --cap-add=IPC_LOCK -d test/image');
});


test('docker test 7', () => {
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
        .isDaemon(true)
        .imageName('test/image')
        .build()
        .join(' ');
    expect(result).toBe(
        'run --name mycontainer --ulimit memlock=-1:-1 --cap-add=IPC_LOCK -e TZ=America/Sao_Paulo '
        + '-e APPLICATION_ENV=test -p 3306:3306 -p 80:80 -v /home/jg:/srv/web -v /etc/test:/etc/test '
        + '-d test/image'
    );
});

test('docker validations 1', () => {
    expect(() => {
        docker.build();
    }).toThrow();
});

test('docker validations 2', () => {
    expect(() => {
        docker.isDaemon(true).isRemove(true);
    }).toThrow();
});

test('docker validations 3', () => {
    expect(() => {
        docker.isDaemon(true).isInteractive(true);
    }).toThrow();
});

test('docker validations 4', () => {
    expect(() => {
        docker.isInteractive(true).isDaemon(true);
    }).toThrow();
});

// test('run', () => {
//     console.log(docker.containerName('aaaa').isInteractive(true).isRemove(true).port(123,123).volume('/tmp', '/tmp').imageName('ubuntu:16.04').commandParam('bash').run());
// });

