'use strict';

const program = require('commander');
const ScriptContainer = require('./include/scriptcontainer');
const Config = require('./include/config');
const usdockerhelper = require('./include/usdockerhelper');

let config = new Config(null, '/tmp');
config.setEmpty('container-suffix', '-container');
config.setEmpty('time-zone', config.getLocalTimeZone());

let sc = new ScriptContainer(config, [__dirname]);

let version = require(__dirname + '/package.json').version;

program
    .version(version)
    .description('USDocker')
    .command('setup')
    .option('-r, --refresh','refresh the list')
    .option('-d, --dump <module>','refresh the list')
    .option('--dump-global','refresh the list')
    .option('--global <variable> <value>','refresh the list')
    .option('-s, --set <module> <variable> <value>','refresh the list')
    .option('-g, --get <module> <variable>','refresh the list')
    .action((var1, var2, var3) => {
        if (var2 === undefined && var3 === undefined) {
            if (var1.refresh) {
                console.log('refreshed')
                sc.load(true);
            } else if (var1.dumpGlobal) {
                console.log(config.dump());
            } else if (var1.dump) {
                console.log(usdockerhelper.getConfig(sc, var1.dump).dump());
            }
        } else if (var2.global) {
            let oldValue = config.get(var2.global);
            config.set(var2.global, var1);
            console.log('global "' + var2.global + '" replaced "' + oldValue + '" by "' + var1 + '"');
        } else if (var2.get) {
            let config = usdockerhelper.getConfig(sc, var2.get);
            console.log(config.get(variable));
        } else if (var3.set) {
            let config = usdockerhelper.getConfig(sc, var3.set);
            let oldValue = config.get(var1);
            config.set(var1, var2);
            console.log('variable "' + var1 + '" replaced "' + oldValue + '" by "' + var2 + '"');
        }
    });

let available = sc.availableScripts();

for (let i=0; i<available.length; i++) {
    program
        .command(available[i] + ' <command>')
        // .description('run setup commands for all envs')
        .action(function(command, options){
            usdockerhelper.run(sc, available[i], command, true);
        });
}

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
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