const chalk = require('chalk');

/**
 * Handle the output of the modules instead to console.log
 */
class Output
{
    /**
     * Constructor
     * @param {boolean} verbosity True is verbosity
     */
    constructor(verbosity)
    {
        this.verbosity = verbosity;
    }

    /**
     * Print a message according to the verbosity.
     * @param {string} normal Print this string if verbositity is false
     * @param {string} verbose Print this string if verbositity is true. If null, return the "normal" string
     */
    print(normal, verbose) {
        if (this.verbosity) {
            let log = (verbose ? verbose : normal);
            if (log) console.log(log);
        } else if (normal) {
            console.log(normal);
        }
    }

    /**
     * Output the Error.message. If verbosity is true, return the stack trace also
     * @param {Error} err
     */
    printErr(err)
    {
        if (!(err instanceof Error)) {
            return;
        }

        if (this.verbosity) {
            console.error(chalk.red(err.stack));
        } else {
            console.error(chalk.red('Error: ' + err.message));
        }
        process.exit(1);
    }
}

module.exports = Output;
