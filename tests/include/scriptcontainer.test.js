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
    expect(result).toEqual(['testcase1', 'testcase2']);
});

test('Check availableCommands', () => {
    let result = scriptcontainer.availableCommands('testcase1');
    expect(result).toEqual(['setup', 'up', 'down', 'expose']);
    let result2 = scriptcontainer.availableCommands('testcase2');
    expect(result2).toEqual(['index', 'close', 'two-words']);
});

test('Mapping from Hyphen to camel case', () => {
    expect(scriptcontainer.cc('two-words')).toBe('twoWords');
    expect(scriptcontainer.cc('three-words-now')).toBe('threeWordsNow');
});

test('Get and Execute a script', () => {
    let result = scriptcontainer.getScript('testcase1');
    expect(result['setup']()).toBe('setup command');
    expect(result['up']()).toBe('up command');
    expect(result['down']()).toBe('down command');
    let result2 = scriptcontainer.getScript('testcase2');
    expect(result2['index']()).toBe('index command');
    expect(result2['close']()).toBe('close command');
    expect(result2[scriptcontainer.cc('two-words')]()).toBe('two-words command');
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
        'testcase2': {
            'file': __dirname + '/mockdir/script2/usdocker_testcase2.js',
            'commands': ['index', 'close', 'two-words']
        },
        'testcase1': {
            'file': __dirname + '/mockdir/script1/usdocker_testcase1.js',
            'commands': ['setup', 'up', 'down', 'expose']
        }
    });

    // Test if cache is working
    let scriptcontainer2 = new ScriptContainerObject(config, [path.join(__dirname, 'mockdir')]);
    let result3 = scriptcontainer2.load();  // Already in cache
    expect(result3).toBe(null);
});

