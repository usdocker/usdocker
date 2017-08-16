'use strict';

const fs = require('fs');
const path = require('path');

const marked = require('marked');
const TerminalRenderer = require('marked-terminal');
const chalk = require('chalk');


module.exports = {

    getDocumentation : function(dirname, file) {
        // return fs.realpathSync(__filename.replace(".js", "") + "/../../docs");

        marked.setOptions({
            // Define custom renderer
            renderer: new TerminalRenderer({
                codespan: chalk.bold.yellow.bgBlackBright,
            })
        });

        if (file === undefined) {
            file = 'index.md';
        }

        let data = fs.readFileSync(path.join(dirname, file));

        return data.toString();
    },

    // showDocs: function(data) {
    //     // Show the parsed data
    //     console.log(marked());
    // }

};