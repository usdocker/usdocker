#!/usr/bin/env node

'use strict';

const program = require('commander');
const fs = require('fs');
const path = require('path');
const fsutil = require('./include/fsutil');
const Output = require('./include/output');

let version = require(__dirname + '/package.json').version;
let output  = new Output(false);

program
    .version(version)
    .description('Create a new script for usdocker based on a template')
    .option('-s, --script <name>','Script name.')
    .option('-o, --output <path>','The output path');


try {
    program.parse(process.argv);

    if (!program.script && !program.output) {
        program.outputHelp();
        process.exit(0);
    }

    if (!program.script || !program.output) {
        throw new Error('The script name and the output is required');
    }

    let destPath = path.join(program.output, 'usdocker-' + program.script);
    if (fs.existsSync(destPath)) {
        throw new Error('The directory ' + destPath + ' already exists');
    }

    output.print('Creating ' + destPath);
    fsutil.copyFolderRecursiveSync(path.join(__dirname, '.template'), destPath);
    fs.renameSync(path.join(destPath, 'usdocker_SERVICE.js'), path.join(destPath, 'usdocker_' + program.script + '.js'));
    fsutil.getFiles(destPath).forEach(function (file) {
        output.print(' .. adjusting ' + file);
        let replaced = fs.readFileSync(path.join(destPath, file)).toString().replace(/__SERVICE__/g, program.script);
        fs.writeFileSync(path.join(destPath, file), replaced);
    });
    output.print('Done :)');

} catch (err) {
    output.printErr(err);
}
