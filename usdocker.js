#!/usr/bin/env node

'use strict';

const program = require('commander');
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

program
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
    program.parse(process.argv);

    script = program.args[0];
    command = program.args[1];
    let config = null;

    if (program.verbose) {
        output.verbosity = true;
    }

    initializeConfig(program.home);

    if (configGlobal.get('docker-host').match(/machine:/)) {
        output.warn('WARNING: Docker-machine environment set to ' + configGlobal.get('docker-host'));
    }

    if (script) {
        if (!sc.existsScript(script)) {
            throw new Error('Script "' + script + '" does not exists.');
        }
        usdockerhelper.run(sc, script, 'setup', false, output);
        config = usdockerhelper.config(script);
    }

    if (program.resetConfig) {
        if (!script) {
            throw new Error('You have to specify the script in order to use --reset-config');
        }
        argParsed();
        usdockerhelper.ask(
            'Are you sure you want to reset the config to the default values?',
            false,
            program.yes,
            program.no,
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

    if (program.resetDatadir) {
        if (!script) {
            throw new Error('You have to specify the script in order to use --reset-datadir');
        }
        argParsed();
        usdockerhelper.ask(
            'Are you sure you want to reset the "data" dir (operation is not reversible)?',
            false,
            program.yes,
            program.no,
            function() {
                fsutil.removeDirectoryRecursive(config.getDataDir());
                output.print('Data dir was deleted!');
            },
            function() {
                output.print('Cancelled!');
            }
        );
    }

    if (program.resetUserdir) {
        if (!script) {
            throw new Error('You have to specify the script in order to use --reset-userdir');
        }
        argParsed();
        usdockerhelper.ask(
            'Are you sure you want to reset the "user" dir (operation is not reversible)?',
            false,
            program.yes,
            program.no,
            function() {
                fsutil.removeDirectoryRecursive(config.getUserDir());
                output.print('User dir was deleted!');
            },
            function() {
                output.print('Cancelled!');
            }
        );
    }

    if (program.refresh) {
        argParsed();
        if (typeof program.refresh === 'string') {
            program.refresh = path.resolve(program.refresh);
            output.warn('Using custom location: ' + program.refresh);
        }
        sc.load(program.refresh);
        output.print(null, 'usdocker database refreshed');
    }

    if (program.global.length !== 0) {
        argParsed();
        for (let i=0; i<program.global.length; i++) {
            let setParts = program.global[i].split('=');
            if (setParts.length !== 2) throw new Error('Invalid key pair set');
            let oldValue = configGlobal.get(setParts[0]);
            configGlobal.set(setParts[0], setParts[1]);
            output.print(null, 'global "' + setParts[0].global + '" replaced "' + oldValue + '" by "' + setParts[1] + '"');
        }
    }

    if (program.get.length !== 0 && script) {
        argParsed();
        for (let i=0; i<program.get.length; i++) {
            output.print(program.get[i] + '=' + config.get(program.get[i]));
        }
    }

    if (program.set.length !== 0 && script) {
        argParsed();
        for (let i=0; i<program.set.length; i++) {
            let setParts = program.set[i].split('=');
            if (setParts.length !== 2) throw new Error('Invalid key pair set');
            let oldValue = config.get(setParts[0]);
            config.set(setParts[0], setParts[1]);
            output.print(null, 'variable "' + setParts[0] + '" replaced "' + oldValue + '" by "' + setParts[1] + '"');
        }
    }

    if (program.dumpGlobal) {
        argParsed();
        output.print(configGlobal.dump());
    }

    if (program.dump && script) {
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
            program.args.slice(2),
            {
                yes: program.yes,
                no: program.no
            }
        );
    }

    if ((!script && !isArgParsed) || (script && !command && !isArgParsed)) {
        program.outputHelp();
    }
} catch (err) {
    output.printErr(err);
}


function initializeConfig(usdockerHome) {
    configGlobal = usdockerhelper.configGlobal(usdockerHome);
    sc = new ScriptContainer(configGlobal);
}

function argParsed() {
    if (output.verbosity) {
        console.log('USDOCKER_HOME=' + configGlobal.getUsdockerHome());
    }
    isArgParsed = true;
}
