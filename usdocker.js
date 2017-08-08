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
let found = false;

program
    .version(version)
    .usage('<command> [action] [options]')
    .description('USDocker is a colletion of useful scripts to make easier brings a service up or down, ' +
        'check status and a lot of other features.'
    )
    .command('setup')
    .description('run setup commands for USDocker and scripts')
    .option('-r, --refresh','refresh the list of available scripts')
    .option('-v, --verbose','Print extra information')
    .option('-d, --dump <script>','Dump the scripts options')
    .option('--dump-global','Dump the global options')
    .option('--global <variable> <value>','Set a global option')
    .option('-s, --set <script> <variable> <value>','Set a script option')
    .option('-g, --get <script> <variable>','Get a script option')
    .action((var1, var2, var3) => {
        found = true;
        let options = var1;
        if (typeof var2 === 'object') {
            options = var2;
        } else if (typeof var3 === 'object') {
            options = var3;
        }

        if (options.verbose) {
            output.verbosity = true;
        }

        if (options.refresh) {
            sc.load(true);
            output.print(null, 'refreshed')
        }

        if (options.global) {
            let oldValue = configGlobal.get(options.global);
            configGlobal.set(options.global, var1);
            output.print(null, 'global "' + var2.global + '" replaced "' + oldValue + '" by "' + var1 + '"');
        }

        if (options.get) {
            let config = usdockerhelper.getConfig(sc, options.get, output);
            output.print(config.get(var1));
        }

        if (options.set) {
            let config = usdockerhelper.getConfig(sc, options.set, output);
            let oldValue = config.get(var1);
            config.set(var1, var2);
            output.print(null, 'variable "' + var1 + '" replaced "' + oldValue + '" by "' + var2 + '"');
        }

        if (options.dumpGlobal) {
            output.print(configGlobal.dump());
        }

        if (options.dump) {
            output.print(usdockerhelper.getConfig(sc, var1.dump, output).dump());
        }
    });

let available = sc.availableScripts();

for (let i=0; i<available.length; i++) {
    program
        .command(available[i] + ' <command>')
        .option('-v, --verbose', 'Print extra information')
        .description('Scripts for ' + available[i])
        .action(function(command, options){
            found = true;
            if (options.verbose) {
                output.verbosity = true;
            }
            usdockerhelper.run(sc, available[i], command, true, output);
        })
        .on('--help', function(){
            console.log('');
            console.log('  Available Scripts:');
            console.log('');
            let scripts = sc.availableCommands(available[i]);
            for (let i=0; i<scripts.length; i++) {
                console.log('    - ' + scripts[i]);
            }
            console.log('');
        });
    ;
}

try {
    program.parse(process.argv);

    if (!found) {
        console.log('\n  error: command/script is invalid!\n');
    }
    if (!process.argv.slice(2).length) {
        program.outputHelp();
    }
} catch (err) {
    output.printErr(err);
}
