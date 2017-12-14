#!/usr/bin/env node

'use strict';

global.program = require('commander');
const ScriptContainer = require('./include/scriptcontainer');
const usdockerhelper = require('./include/usdocker');
const Output = require('./include/output');
const fs = require('fs');
const fsutil = require('./include/fsutil');
const path = require('path');

// Important Variables
let configGlobal = null;
let sc = null;

let version = require(__dirname + '/package.json').version;
let output = new Output(false);
let script = null;
let command = null;
let isArgParsed = false;

function collect(val, memo) {
    memo.push(val);
    return memo;
}

global.program
    .version(version)
    .usage('<script> [options] [command] ')
    .description('USDocker is a colletion of useful scripts to make easier brings a service up or down, ' +
        'check status and a lot of other features.'
    )
    .option('-d, --dump','Dump the scripts options')
    .option('--dump-global','Dump the global options')
    .option('-s, --set <key-pair>','Set a script configuration. Key-pair is key=value', collect, [])
    .option('-g, --get <key>','Get a script option', collect, [])
    .option('--global <key-pair>','Set a global configuration for usdocker. Key-pair is key=value', collect, [])
    .option('-r, --refresh [searchFolder]','refresh the list of available scripts')
    .option('-v, --verbose','Print extra information')
    .option('--yes', 'answer YES to any question')
    .option('--no', 'answer NO to any question')
    .option('--home <path>', 'The home directory for USDOCKER. May also be setting using USDOCKER_HOME environment variable')
    .option('--no-link', 'No link the current container with the running containers')
    .option('--reset-config', 'reset all config to the default values')
    .option('--reset-datadir', 'reset all user data. Be careful because this operation is not reversible!')
    .option('--reset-userdir', 'reset all config user data. Be careful because this operation is not reversible!')
    .on('--help', function(){
        console.log('');
        if (!script) {
            console.log('  Available Scripts:');
            console.log('');
            let scripts = sc.availableScripts();
            for (let i = 0; i < scripts.length; i++) {
                console.log('    - ' + scripts[i]);
            }
        } else {
            console.log('  Available commands for script "' + script + '":');
            console.log('');
            let commands = sc.availableCommands(script);
            for (let i = 0; i < commands.length; i++) {
                console.log('    - ' + commands[i]);
            }
        }
        console.log('');
    });


try {
    global.program.parse(process.argv);

    script = global.program.args[0];
    command = global.program.args[1];
    let config = null;

    if (global.program.verbose) {
        output.verbosity = true;
    }

    initializeConfig();

    if (configGlobal.get('docker-host').match(/machine:/)) {
        output.warn('WARNING: Docker-machine environment set to ' + configGlobal.get('docker-host'));
    }

    if (global.program.refresh) {
        argParsed();
        if (typeof global.program.refresh === 'string') {
            global.program.refresh = path.resolve(global.program.refresh);
            output.warn('Using custom location: ' + global.program.refresh);
        }
        sc.load(global.program.refresh);
        output.print(null, 'usdocker database refreshed');
    }

    if (script) {
        if (!sc.existsScript(script)) {
            throw new Error('Script "' + script + '" does not exists.');
        }
        usdockerhelper.run(sc, script, 'setup', false, output);
        config = usdockerhelper.config(script);
    }

    if (global.program.resetConfig) {
        if (!script) {
            throw new Error('You have to specify the script in order to use --reset-config');
        }
        argParsed();
        usdockerhelper.ask(
            'Are you sure you want to reset the config to the default values?',
            false,
            global.program.yes,
            global.program.no,
            function() {
                fs.unlinkSync(config.path());
                output.print('Config reset');
                process.exit(0);
            },
            function() {
                output.print('Cancelled!');
            }
        );
    }

    if (global.program.resetDatadir) {
        if (!script) {
            throw new Error('You have to specify the script in order to use --reset-datadir');
        }
        argParsed();
        usdockerhelper.ask(
            'Are you sure you want to reset the "data" dir (operation is not reversible)?',
            false,
            global.program.yes,
            global.program.no,
            function() {
                fsutil.removeDirectoryRecursive(config.getDataDir());
                output.print('Data dir was deleted!');
            },
            function() {
                output.print('Cancelled!');
            }
        );
    }

    if (global.program.resetUserdir) {
        if (!script) {
            throw new Error('You have to specify the script in order to use --reset-userdir');
        }
        argParsed();
        usdockerhelper.ask(
            'Are you sure you want to reset the "user" dir (operation is not reversible)?',
            false,
            global.program.yes,
            global.program.no,
            function() {
                fsutil.removeDirectoryRecursive(config.getUserDir());
                output.print('User dir was deleted!');
            },
            function() {
                output.print('Cancelled!');
            }
        );
    }

    if (global.program.global.length !== 0) {
        argParsed();
        for (let i=0; i<global.program.global.length; i++) {
            let setParts = global.program.global[i].split('=');
            if (setParts.length !== 2) throw new Error('Invalid key pair set');
            let oldValue = configGlobal.get(setParts[0]);
            configGlobal.set(setParts[0], setParts[1]);
            output.print(null, 'global "' + setParts[0] + '" replaced "' + oldValue + '" by "' + setParts[1] + '"');
        }
    }

    if (global.program.get.length !== 0 && script) {
        argParsed();
        for (let i=0; i<global.program.get.length; i++) {
            output.print(global.program.get[i] + '=' + config.get(global.program.get[i]));
        }
    }

    if (global.program.set.length !== 0 && script) {
        argParsed();
        for (let i=0; i<global.program.set.length; i++) {
            let setParts = global.program.set[i].split('=');
            if (setParts.length !== 2) throw new Error('Invalid key pair set');
            let oldValue = config.get(setParts[0]);
            config.set(setParts[0], setParts[1]);
            output.print(null, 'variable "' + setParts[0] + '" replaced "' + oldValue + '" by "' + setParts[1] + '"');
        }
    }

    if (global.program.dumpGlobal) {
        argParsed();
        output.print(configGlobal.dump());
    }

    if (global.program.dump && script) {
        argParsed();
        output.print(config.dump());
    }

    if (command) {
        command = sc.cc(command);
        usdockerhelper.run(
            sc,
            script,
            command,
            false,
            output,
            global.program.args.slice(2),
            {
                yes: global.program.yes,
                no: global.program.no
            }
        );
    }

    if ((!script && !isArgParsed) || (script && !command && !isArgParsed)) {
        global.program.outputHelp();
    }
} catch (err) {
    output.printErr(err);
}


function initializeConfig() {
    configGlobal = usdockerhelper.configGlobal();
    sc = new ScriptContainer(configGlobal);
}

function argParsed() {
    if (output.verbosity) {
        console.log('USDOCKER_HOME=' + configGlobal.getUsdockerHome());
    }
    isArgParsed = true;
}
