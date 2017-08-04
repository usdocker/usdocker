'use strict';

const ScriptContainerObject = require('../../include/scriptcontainer');
const ConfigObject = require('../../include/config');

const path = require('path');
const shell = require('shelljs');

let scriptcontainer;

beforeEach(() => {
    scriptcontainer = new ScriptContainerObject(null, [path.join(__dirname, 'mockdir')]);
    scriptcontainer.load();
});

afterEach(() => {
    scriptcontainer = null;
    shell.rm('-rf', '/tmp/.usdocker');
    shell.rm('-rf', '/tmp/.usdocker_data');
});

test('Check availableScripts', () => {
    let result = scriptcontainer.availableScripts();
    expect(result).toEqual(['main', 'another']);
});

test('Check availableCommands', () => {
    let result = scriptcontainer.availableCommands('main');
    expect(result).toEqual(["setup", "up", "down", "helpPath", "expose"]);
    let result2 = scriptcontainer.availableCommands('another');
    expect(result2).toEqual(["index", "close"]);
});


test('Get and Execute a script', () => {
    let result = scriptcontainer.getScript('main');
    expect(result['setup']()).toBe('setup command');
    expect(result['up']()).toBe('up command');
    expect(result['down']()).toBe('down command');
    let result2 = scriptcontainer.getScript('another');
    expect(result2['index']()).toBe('index command');
    expect(result2['close']()).toBe('close command');
});

test('ScriptContainer with a config object for cache', () => {
    // Create a fresh object
    let config = new ConfigObject('scriptmodule', '/tmp');
    scriptcontainer = new ScriptContainerObject(config, [path.join(__dirname, 'mockdir')]);
    let result = scriptcontainer.load();
    expect(result).toBe(true);
    let result2 = scriptcontainer.load();  // Already Readed!!
    expect(result2).toBe(false);
    expect(config.get('cachescripts')).toEqual({
        "another": __dirname + "/mockdir/script2/usdocker_another.js",
        "main": __dirname + "/mockdir/script1/usdocker_main.js"
    });

    // Test if cache is working
    let scriptcontainer2 = new ScriptContainerObject(config, [path.join(__dirname, 'mockdir')]);
    let result3 = scriptcontainer2.load();  // Already in cache
    expect(result3).toBe(null);
});

