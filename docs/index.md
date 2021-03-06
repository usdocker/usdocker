# USDocker - Useful Scripts for Docker
[![npm version](https://badge.fury.io/js/%40usdocker%2Fusdocker.svg)](https://badge.fury.io/js/%40usdocker%2Fusdocker)
[![Build Status](https://travis-ci.org/usdocker/usdocker.svg?branch=master)](https://travis-ci.org/usdocker/usdocker)

USDocker is a colletion of useful scripts to make easier brings a service up, down the service, check status
and a lot of other features. It turns a docker image as an appliance.
 
Usdocker is highly customizable.

## Command Line Basic Usage

The most common usage is:

```
usdocker SERVICE COMMAND
```

If you want start a mysql service you only need to:

```
usdocker mysql up
```

If you call `usdocker SERVICE` without the command you get the help for the service

## Installing usdocker 

USDocker is a npm package. Normally you do not want install only the USDocker
but a usefull script running on top of USDocker library. 
The install will be:

```bash
npm install -g @usdocker/usdocker  # This package is mandatory
npm install -g usdocker-<SCRIPT\>  # Here the USDocker package.
``` 

See below the list of official scripts available, documentation and how to install it:
- [elasticsearch](https://github.com/usdocker/usdocker-elastic)
- [jekyll]
- [lemp](https://github.com/usdocker/usdocker-lemp) (Linux+Nginx+MySQL+PHP)
- [kibana](https://github.com/usdocker/usdocker-elastic)
- [memcached](https://github.com/usdocker/usdocker-memcached)
- [mongodb](https://github.com/usdocker/usdocker-mongodb)
- [mssql](https://github.com/usdocker/usdocker-mssql)
- [mysql](https://github.com/usdocker/usdocker-mysql)
- [oracle xe 11g](https://github.com/usdocker/usdocker-oracle-xe)
- [php]
- [postgres](https://github.com/usdocker/usdocker-postgres)
- [redis](https://github.com/usdocker/usdocker-redis)
- [redis-sentinel]
- [wordpress](https://github.com/usdocker/usdocker-wordpress)

Did not found the service you want? Feel free to create it and send to us again! 
Follow our [guide](guide.md), read about the [API](api.md) and [directories](directories.md) to create your own script.
After created your script you may want add to this list creating a pull request. 

## Most common Useful Scripts commands

```
  Usage: usdocker <script> [options] [command] 

  USDocker is a colletion of useful scripts to make easier brings a service up or down, check status and a lot of other features.

  Options:

    -V, --version                 output the version number
    -d, --dump                    Dump the scripts options
    --dump-global                 Dump the global options
    -s, --set <key-pair>          Set a script configuration. Key-pair is key=value (default: )
    -g, --get <key>               Get a script option (default: )
    --global <key-pair>           Set a global configuration for usdocker. Key-pair is key=value (default: )
    -r, --refresh [searchFolder]  refresh the list of available scripts
    -v, --verbose                 Print extra information
    --yes                         answer YES to any question
    --no                          answer NO to any question
    --home <path>                 The home directory for USDOCKER. May also be setting using USDOCKER_HOME environment variable
    --no-link                     No link the current container with the running containers (default: true)
    --reset-config                reset all config to the default values
    --reset-datadir               reset all user data. Be careful because this operation is not reversible!
    --reset-userdir               reset all config user data. Be careful because this operation is not reversible!
    -h, --help                    output usage information
```

### Refreshing USDocker local database

After install a new script you have to refresh the LIST by using:

```bash
usdocker -rv    # based on the current usdocker installation
usdocker -v --refresh <folder>   # based on a specific folder
```

### Link the container with running containers. 

By the default a USDocker container is linked with the current running containers. 

For example:

```bash
usdocker mysql up      # Will up the the MySQL container
usdocker wordpress up  # Will up the wordpress and link with the MySQL container automatically
```

This behavior can be override using the `--no-link` argument:

```bash
usdocker wordpress --no-link up  # Will up the wordpress without link with any container. 
```

### Running with extra information

Add the parameter `-v` to your command line.


### Manipulating the script setup

The USDocker script are customizable by variables. Here you can see how to
customize your script;

#### Discover what configuration are available


```bash
usdocker <your_script> --dump
```

#### Get the current value


```bash
usdocker <your_script> --get key
```

#### Set a new value


```bash
usdocker <your_script> --set key=value
```

**Caution** If you put a wrong value here you can stop the service or cause damage on your computer.  


#### Reseting data


Reset only the user environment

```
usdocker SERVICE --reset-userdir
```

Reset the user data including database, data produced by the user and others:

```
usdocker SERVICE --reset-datadir
```

Note that this operation is irreversible.

## Setting the Docker Host

USDocker points to the local socket by default. But you can change this by using the command:

**API Not authenticated (for windows or mac)**

```bash
usdocker --global http://127.0.0.1:2736
```

**Docker  machine**

```bash
usdocker --global machine:///path/to/dockermachine/dir
```

**Linux Socket (default)**

```bash
usdocker --global /var/run/docker.sock
```

## Running on Windows or Mac

If you running on Windows or Mac you probably set or the Docker Machine or the API Not Authenticated;

In both cases you need to map a local directory into the host server. 

```bash
usdocker --global mappingDirFrom=/mnt/c/
usdocker --global mappingDirTo=C:/
```

## API

You can use USDocker in your node.js projects for wrap the "docker run"
and do basic operations like PULL, RUN, STOP and others. 

Here an example:

```javascript
const usdocker = require('@usdocker/usdocker');

let docker = usdocker.dockerRunWrapper(configGlobal);
docker
    .image('ubuntu:16.04')
    .isInteractive(true)
    .isDetached(false)
    .commandParam('bash')
;

usdocker.up('ubuntu-container', docker, function(normal, verbose) {
    // do something
});
```

Check for the [API](api.md) documentaton [clicking here](api.md) 

## More Information

- [Installing on Windows](windows.md)
- [Installing on Mac](mac.md)
- [Troubleshot](troubleshot.md)
 
## Contributing 

If you wanna contributing  to our project and create your own Useful Script for Docker, 
follow our [guide](guide.md), read about [API](api.md) and [directories](directories.md) to create your own.
After created your script you may want add to this list creating a pull request. 


## *Live/Production environment*

This is script can safely run on live/production environment. But we strongly recommend you backup the data
saved into `$USD_DATA` directory. 

## *Important Note*

*USDocker was implemented to run on the same machine where the docker daemon is running.* 

This script not intended to run from local to remote machines throught docker-machine.
 
If you have a Windows or Mac environment please can install the USDOCKER directly into the remote machine
and run USDOCKER from there.

## *Disclaimer*

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, 
BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR 
PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, 
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)

HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT 
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN 
IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
