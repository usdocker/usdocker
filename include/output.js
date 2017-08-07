
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

        if (!this.verbosity) {
            console.error('Error: ' + err.message);
        } else {
            console.error(err);
        }
        process.exit(1);
    }
}

module.exports = Output;
