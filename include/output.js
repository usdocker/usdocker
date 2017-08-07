const chalk = require('chalk');

class Output
{
    constructor(verbosity)
    {
        this.verbosity = verbosity;
    }

    print(normal, verbose) {
        if (this.verbosity) {
            let log = (verbose ? verbose : normal);
            if (log) console.log(log);
        } else if (normal) {
            console.log(normal);
        }
    }

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
