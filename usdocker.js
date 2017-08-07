'use strict';

const program = require('commander');
const ScriptContainer = require('./include/scriptcontainer');
const Config = require('./include/config');
const usdockerhelper = require('./include/usdockerhelper');

let configGlobal = new Config(null, '/tmp');

let sc = new ScriptContainer(configGlobal, [__dirname]);

let version = require(__dirname + '/package.json').version;
let verbose = false;

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
        let options = var1;
        if (typeof var2 === 'object') {
            options = var2;
        } else if (typeof var3 === 'object') {
            options = var3;
        }

        if (options.verbose) {
            verbose = true;
        }

        if (options.refresh) {
            sc.load(true);
            console.log('refreshed')
        }

        if (options.global) {
            let oldValue = configGlobal.get(options.global);
            configGlobal.set(options.global, var1);
            console.log('global "' + var2.global + '" replaced "' + oldValue + '" by "' + var1 + '"');
        }

        if (options.get) {
            let config = usdockerhelper.getConfig(sc, options.get);
            console.log(config.get(var1));
        }

        if (options.set) {
            let config = usdockerhelper.getConfig(sc, options.set);
            let oldValue = config.get(var1);
            config.set(var1, var2);
            console.log('variable "' + var1 + '" replaced "' + oldValue + '" by "' + var2 + '"');
        }

        if (options.dumpGlobal) {
            console.log(configGlobal.dump());
        }

        if (options.dump) {
            console.log(usdockerhelper.getConfig(sc, var1.dump).dump());
        }
    });

let available = sc.availableScripts();

for (let i=0; i<available.length; i++) {
    program
        .command(available[i] + ' <command>')
        .option('-v, --verbose', 'Print extra information')
        .description('Scripts for ' + available[i])
        .action(function(command, options){
            if (options.verbose) {
                verbose = true;
            }
            usdockerhelper.run(sc, available[i], command, true);
        });
}

try {
    program.parse(process.argv);

    if (!process.argv.slice(2).length) {
        program.outputHelp();
    }
} catch (err) {
    console.error("Error: " + err.message);
    if (verbose) {
        console.error(err);
    }
}



// program
//     .version('0.0.1')
//     .command('command <req> [optional]')
//     .description('command description')
//     .option('-x, --xadrez','we can still have add options')
//     .option('-t, --test','we can still have add options')
//     .action((req,optional,options) => {
//         console.log('.action() allows us to implement the command');
//         console.log('User passed %s', req);
//         console.log(optional);
//         console.log(options);
//         if (options.xadrez) {
//             console.log('passou a opção "option"');
//         }
//     });
//
// program.parse(process.argv);
//
// if (!process.argv.slice(2).length) {
//     program.outputHelp();
// }


/*
var x = require('./include/config');

x.init('a');



// https://stackoverflow.com/questions/10914751/loading-node-js-modules-dynamically-based-on-route


program
    .version('0.1.0')
    .option('-C, --chdir <path>', 'change the working directory')
    .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
    .option('-T, --no-tests', 'ignore test hook');

program
    .command('setup [env]')
    .description('run setup commands for all envs')
    .option("-s, --setup_mode [mode]", "Which setup mode to use")
    .action(function(env, options){
        var mode = options.setup_mode || "normal";
        env = env || 'all';
        console.log('setup for %s env(s) with %s mode', env, mode);
    });

program
    .command('exec <cmd>')
    .alias('ex')
    .description('execute the given remote cmd')
    .option("-e, --exec_mode <mode>", "Which exec mode to use")
    .action(function(cmd, options){
        console.log('exec "%s" using %s mode', cmd, options.exec_mode);
    }).on('--help', function() {
        console.log('  Examples:');
        console.log();
        console.log('    $ deploy exec sequential');
        console.log('    $ deploy exec async');
        console.log();
    });

program
    .command('*')
    .action(function(env){
        console.log('deploying "%s"', env);
    });

program.parse(process.argv);

*/