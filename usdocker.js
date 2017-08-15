'use strict';

const program = require('commander');
const ScriptContainer = require('./include/scriptcontainer');
const Config = require('./include/config');
const usdockerhelper = require('./include/usdockerhelper');
const Output = require('./include/output');

let configGlobal = new Config(null, '/tmp');

let sc = new ScriptContainer(configGlobal, [__dirname]);

let version = require(__dirname + '/package.json').version;
let output = new Output(false);
let script = null;
let command = null;

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
    .option('-r, --refresh','refresh the list of available scripts')
    .option('-v, --verbose','Print extra information')
    .option('-d, --dump','Dump the scripts options')
    .option('--dump-global','Dump the global options')
    .option('--global <key-pair>','Set a global configuration for usdocker. Key-pair is key=value', collect, [])
    .option('-s, --set <key-pair>','Set a script configuration. Key-pair is key=value', collect, [])
    .option('-g, --get <key>','Get a script option', collect, [])
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
                let commands = sc.availableCommands(script)
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
    let found = false;

    if (program.verbose) {
        output.verbosity = true;
    }

    if (script) {
        if (!sc.existsScript(script)) {
            throw new Error('Script "' + script + '" does not exists.');
        }
        config = usdockerhelper.getConfig(sc, script, output);
    }

    if (program.refresh) {
        found = true;
        sc.load(true);
        output.print(null, 'refreshed')
    }

    if (program.global.length !== 0) {
        found = true;
        for (let i=0; i<program.global.length; i++) {
            let setParts = program.global[i].split('=');
            if (setParts.length !== 2) throw new Error('Invalid key pair set');
            let oldValue = configGlobal.get(setParts[0]);
            configGlobal.set(setParts[0], setParts[1]);
            output.print(null, 'global "' + setParts[0].global + '" replaced "' + oldValue + '" by "' + setParts[1] + '"');
        }
    }

    if (program.get.length !== 0 && script) {
        found = true;
        for (let i=0; i<program.get.length; i++) {
            output.print(program.get[i] + '=' + config.get(program.get[i]));
        }
    }

    if (program.set.length !== 0 && script) {
        found = true;
        for (let i=0; i<program.set.length; i++) {
            let setParts = program.set[i].split('=');
            if (setParts.length !== 2) throw new Error('Invalid key pair set');
            let oldValue = config.get(setParts[0]);
            config.set(setParts[0], setParts[1]);
            output.print(null, 'variable "' + setParts[0] + '" replaced "' + oldValue + '" by "' + setParts[1] + '"');
        }
    }

    if (program.dumpGlobal) {
        found = true;
        output.print(configGlobal.dump());
    }

    if (program.dump && script) {
        found = true;
        output.print(config.dump());
    }

    if (command) {
        command = sc.cc(command);
        usdockerhelper.run(sc, script, command, false, output, program.args.slice(2));
    }

    if ((!script && !found) || (script && !command && !found)) {
        program.outputHelp();
    }
} catch (err) {
    output.printErr(err);
}
