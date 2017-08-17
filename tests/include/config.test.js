const ConfigObject = require('../../include/config');
const fs = require('fs');
const shell = require('shelljs');

let config;

beforeEach(() => {
    config = new ConfigObject('mymodule', '/tmp');
});

afterEach(() => {
    config = null;
    shell.rm('-rf', '/tmp/.usdocker');
});

test('Check directories name', () => {
    expect(fs.statSync('/tmp/.usdocker/setup/mymodule').isDirectory()).toBe(true);
    expect(fs.statSync('/tmp/.usdocker/data/mymodule').isDirectory()).toBe(true);

    expect(config.getUserDir('test')).toBe('/tmp/.usdocker/setup/mymodule/test');
    expect(config.getDataDir()).toBe('/tmp/.usdocker/data/mymodule');
});

test('Test set and get config', () => {
    expect(fs.existsSync('/tmp/.usdocker/setup/mymodule/environment.json')).toBe(false);
    config.set('test', 'value');
    expect(fs.existsSync('/tmp/.usdocker/setup/mymodule/environment.json')).toBe(true);
    let result = config.get('test');
    expect(result).toBe('value');

    // Check content
    let content = JSON.parse(fs.readFileSync('/tmp/.usdocker/setup/mymodule/environment.json').toString());
    expect(content).toEqual({test:'value'});

    let result2 = config.get('not-exists');
    expect(result2).toBe(undefined);
    config.clear('test');
    let result3 = config.get('test');
    expect(result3).toBe(undefined);

    // Check content
    let content2 = JSON.parse(fs.readFileSync('/tmp/.usdocker/setup/mymodule/environment.json').toString());
    expect(content2).toEqual({});
});

test('Test set empty', () => {
    expect(fs.existsSync('/tmp/.usdocker/setup/mymodule/environment.json')).toBe(false);

    let check = config.get('test');
    expect(check).toBe(undefined);

    config.setEmpty('test', 'value');
    let result = config.get('test');
    expect(result).toBe('value');

    config.setEmpty('test', 'newvalue');
    let result2 = config.get('test');
    expect(result2).toBe('value');

    config.set('test', 'other');
    let result3 = config.get('test');
    expect(result3).toBe('other');
});

test('Test set and get nested keys', () => {
    expect(fs.existsSync('/tmp/.usdocker/setup/mymodule/environment.json')).toBe(false);
    config.set('test:a', 'valuea');
    expect(fs.existsSync('/tmp/.usdocker/setup/mymodule/environment.json')).toBe(true);
    config.set('test:b', 'valueb');
    let result = config.get('test');
    expect(result.a).toBe('valuea');
    expect(result.b).toBe('valueb');

    // Check content
    let content = JSON.parse(fs.readFileSync('/tmp/.usdocker/setup/mymodule/environment.json').toString());
    expect(content).toEqual({test:{a:'valuea', b:'valueb'}});
});

test('Test creating config user dir', () => {
    expect(fs.existsSync('/tmp/.usdocker/setup/mymodule/mockdir')).toBe(false);
    let result = config.copyToUserDir(__dirname + '/mockdir');
    expect(result).toBe(undefined);
    expect(fs.existsSync('/tmp/.usdocker/setup/mymodule/mockdir')).toBe(true);
    expect(fs.existsSync('/tmp/.usdocker/setup/mymodule/mockdir/justfortest.txt')).toBe(true);
    let result2 = config.copyToUserDir(__dirname + '/mockdir');
    expect(result2).toBe(true);
});

test('Test creating config data dir', () => {
    expect(fs.existsSync('/tmp/.usdocker/data/mymodule/mockdir')).toBe(false);
    let result = config.copyToDataDir(__dirname + '/mockdir');
    expect(result).toBe(undefined);
    expect(fs.existsSync('/tmp/.usdocker/data/mymodule/mockdir')).toBe(true);
    expect(fs.existsSync('/tmp/.usdocker/data/mymodule/mockdir/justfortest.txt')).toBe(true);
    let result2 = config.copyToDataDir(__dirname + '/mockdir');
    expect(result2).toBe(true);
});


test('Test store an object and retrieve data', () => {
    expect(fs.existsSync('/tmp/.usdocker/setup/mymodule/environment.json')).toBe(false);
    config.set('test', {a: 'testa', b: {b1: 'testb1', b2: 'testb2'}});
    expect(fs.existsSync('/tmp/.usdocker/setup/mymodule/environment.json')).toBe(true);
    let result = config.get('test');
    expect(result).toEqual({a: 'testa', b:  {b1: 'testb1', b2: 'testb2'}});
    let result2 = config.get('test:b');
    expect(result2).toEqual({b1: 'testb1', b2: 'testb2'});
    let result3 = config.get('test:b:b1');
    expect(result3).toBe('testb1');
    config.set('test:b:b1', 'new');
    let result4 = config.get('test');
    expect(result4).toEqual({a: 'testa', b:  {b1: 'new', b2: 'testb2'}});

    // Check content
    let content = JSON.parse(fs.readFileSync('/tmp/.usdocker/setup/mymodule/environment.json').toString());
    expect(content).toEqual({test:{a: 'testa', b: {b1: 'new', b2: 'testb2'}}});
});



test('Check error treatment for user dir inexistant', () => {
    expect(() => {
        config.copyToUserDir(__dirname + '/does-not-exists');
    }).toThrow();
});
