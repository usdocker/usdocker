## Modules

<dl>
<dt><a href="#module_fsutil">fsutil</a></dt>
<dd><p>Some synchronous utilities functions for manipulate the file system.</p>
</dd>
<dt><a href="#module_usdocker">usdocker</a></dt>
<dd><p>Helper class to run docker commands/action</p>
</dd>
</dl>

## Classes

<dl>
<dt><a href="#Config">Config</a></dt>
<dd><p>Class to handle the configuration of the script</p>
</dd>
<dt><a href="#DockerListWrapper">DockerListWrapper</a></dt>
<dd><p>Wrapper for the &quot;docker list&quot; command line</p>
</dd>
<dt><a href="#DockerRunWrapper">DockerRunWrapper</a></dt>
<dd><p>Wrapper for the &quot;docker run&quot; command line</p>
</dd>
<dt><a href="#DockerWrapper">DockerWrapper</a></dt>
<dd><p>Abstract class for implement docker wrapper class</p>
</dd>
<dt><a href="#Output">Output</a></dt>
<dd><p>Handle the output of the modules instead to console.log</p>
</dd>
<dt><a href="#ScriptContainer">ScriptContainer</a></dt>
<dd><p>Handle where to locate and how to load and run the string</p>
</dd>
</dl>

<a name="module_fsutil"></a>

## fsutil
Some synchronous utilities functions for manipulate the file system.

<a name="module_usdocker"></a>

## usdocker
Helper class to run docker commands/action


* [usdocker](#module_usdocker)
    * [.pull(image, callback)](#module_usdocker.pull)
    * [.up(instance, dockerRunWrapper, callback)](#module_usdocker.up)
    * [.down(instance, callback)](#module_usdocker.down)
    * [.outputRaw(option, dockerrunwrapper)](#module_usdocker.outputRaw) ⇒ <code>\*</code>
    * [.restart(instance, dockerRunWrapper, callback)](#module_usdocker.restart)
    * [.status(instance, callback)](#module_usdocker.status)
    * [.run(sc, script, command, setup)](#module_usdocker.run)
    * [.runUsingApi(dockerrunwrapper)](#module_usdocker.runUsingApi)
    * [.runUsingCli(dockerrunwrapper)](#module_usdocker.runUsingCli)
    * [.exec(instance, cmd, callback)](#module_usdocker.exec)
    * [.ask(question, defaultValue, optYes, optNo, yesFn, noFn)](#module_usdocker.ask)
    * [.config(script)](#module_usdocker.config) ⇒ [<code>Config</code>](#Config)
    * [.configGlobal()](#module_usdocker.configGlobal) ⇒ [<code>Config</code>](#Config)
    * [.dockerRunWrapper(configGlobal)](#module_usdocker.dockerRunWrapper) ⇒ [<code>DockerRunWrapper</code>](#DockerRunWrapper)
    * [.fsutil()](#module_usdocker.fsutil) ⇒ <code>fsutil</code>
    * [.getHostIpAddress()](#module_usdocker.getHostIpAddress) ⇒ <code>Array</code>

<a name="module_usdocker.pull"></a>

### usdocker.pull(image, callback)
Pull an docker image

**Kind**: static method of [<code>usdocker</code>](#module_usdocker)  

| Param | Type | Description |
| --- | --- | --- |
| image | <code>string</code> | The image name |
| callback |  | The callback function |

**Example**  
```js
usdocker.pull('ubuntu:16.04', function(err) {
    if (err) {
       console.log(err);
       return;
    }
    // Do if is OK
});
```
<a name="module_usdocker.up"></a>

### usdocker.up(instance, dockerRunWrapper, callback)
Create and run a container based on the DockerRunWrapper parameter.

**Kind**: static method of [<code>usdocker</code>](#module_usdocker)  

| Param | Type |
| --- | --- |
| instance | <code>string</code> | 
| dockerRunWrapper | [<code>DockerRunWrapper</code>](#DockerRunWrapper) | 
| callback |  | 

**Example**  
```js
let docker = usdocker.dockerRunWrapper(configGlobal);
docker.image('ubuntu:16.04').isInteractive(true).isDetached(false).commandParam('bash');
usdocker.up('ubuntu-container', docker, function(normal, verbose) {
   // do something
});
```
<a name="module_usdocker.down"></a>

### usdocker.down(instance, callback)
Shutdown a container defined by the name. The container suffix will be added automatically

**Kind**: static method of [<code>usdocker</code>](#module_usdocker)  

| Param | Type |
| --- | --- |
| instance | <code>string</code> | 
| callback |  | 

**Example**  
```js
usdocker.down('ubuntu-container', function(normal, verbose) {
   // do something
});
```
<a name="module_usdocker.outputRaw"></a>

### usdocker.outputRaw(option, dockerrunwrapper) ⇒ <code>\*</code>
Return the RAW docker wrapper command.

**Kind**: static method of [<code>usdocker</code>](#module_usdocker)  

| Param | Type | Description |
| --- | --- | --- |
| option | <code>string</code> | Can be "api" to return the json for the docker API or CLI to return the document command. |
| dockerrunwrapper |  |  |

<a name="module_usdocker.restart"></a>

### usdocker.restart(instance, dockerRunWrapper, callback)
Restart a container defined by the name. The container suffix will be added automatically

**Kind**: static method of [<code>usdocker</code>](#module_usdocker)  

| Param | Type |
| --- | --- |
| instance | <code>string</code> | 
| dockerRunWrapper | [<code>DockerRunWrapper</code>](#DockerRunWrapper) | 
| callback |  | 

**Example**  
```js
let docker = usdocker.dockerRunWrapper(configGlobal);
docker.image('ubuntu:16.04').isInteractive(true).isDetached(false).commandParam('bash');
usdocker.down('ubuntu-container', docker, function(normal, verbose) {
   // do something
});
```
<a name="module_usdocker.status"></a>

### usdocker.status(instance, callback)
Get the container running status. The container suffix will be added automatically

**Kind**: static method of [<code>usdocker</code>](#module_usdocker)  

| Param | Type |
| --- | --- |
| instance | <code>string</code> | 
| callback |  | 

**Example**  
```js
usdocker.status('ubuntu-container', function(normal, verbose) {
   // do something
});
```
<a name="module_usdocker.run"></a>

### usdocker.run(sc, script, command, setup)
Run a method of the script.

**Kind**: static method of [<code>usdocker</code>](#module_usdocker)  

| Param | Type |
| --- | --- |
| sc | [<code>ScriptContainer</code>](#ScriptContainer) | 
| script | [<code>Config</code>](#Config) | 
| command | <code>string</code> | 
| setup | <code>boolean</code> | 

<a name="module_usdocker.runUsingApi"></a>

### usdocker.runUsingApi(dockerrunwrapper)
Run a container based on the DockerRunWrapper definition

**Kind**: static method of [<code>usdocker</code>](#module_usdocker)  

| Param | Type |
| --- | --- |
| dockerrunwrapper | [<code>DockerRunWrapper</code>](#DockerRunWrapper) | 

<a name="module_usdocker.runUsingCli"></a>

### usdocker.runUsingCli(dockerrunwrapper)
Run a container based on the DockerRunWrapper definition

**Kind**: static method of [<code>usdocker</code>](#module_usdocker)  

| Param | Type |
| --- | --- |
| dockerrunwrapper | [<code>DockerRunWrapper</code>](#DockerRunWrapper) | 

<a name="module_usdocker.exec"></a>

### usdocker.exec(instance, cmd, callback)
Exec a container and attach a terminal

**Kind**: static method of [<code>usdocker</code>](#module_usdocker)  

| Param | Type |
| --- | --- |
| instance | <code>string</code> | 
| cmd | <code>Array</code> | 
| callback |  | 

**Example**  
```js
usdocker.exec('mysql-container', ['bash'], function(err) {
   if (err) console.log(err);
   // do something
});
```
<a name="module_usdocker.ask"></a>

### usdocker.ask(question, defaultValue, optYes, optNo, yesFn, noFn)
Helper for ask a question

**Kind**: static method of [<code>usdocker</code>](#module_usdocker)  

| Param | Type | Description |
| --- | --- | --- |
| question | <code>string</code> |  |
| defaultValue | <code>boolean</code> |  |
| optYes | <code>boolean</code> |  |
| optNo | <code>boolean</code> |  |
| yesFn |  | Callback for the result in case of success |
| noFn |  | Callback for the result in case of success |

<a name="module_usdocker.config"></a>

### usdocker.config(script) ⇒ [<code>Config</code>](#Config)
Return a new Config object

**Kind**: static method of [<code>usdocker</code>](#module_usdocker)  

| Param |
| --- |
| script | 

<a name="module_usdocker.configGlobal"></a>

### usdocker.configGlobal() ⇒ [<code>Config</code>](#Config)
Return a new Config object with Global setup

**Kind**: static method of [<code>usdocker</code>](#module_usdocker)  
<a name="module_usdocker.dockerRunWrapper"></a>

### usdocker.dockerRunWrapper(configGlobal) ⇒ [<code>DockerRunWrapper</code>](#DockerRunWrapper)
Return a new DockerRunWrapper

**Kind**: static method of [<code>usdocker</code>](#module_usdocker)  

| Param |
| --- |
| configGlobal | 

<a name="module_usdocker.fsutil"></a>

### usdocker.fsutil() ⇒ <code>fsutil</code>
Get an fsutil module

**Kind**: static method of [<code>usdocker</code>](#module_usdocker)  
<a name="module_usdocker.getHostIpAddress"></a>

### usdocker.getHostIpAddress() ⇒ <code>Array</code>
Get the IPAddress on the host system.

**Kind**: static method of [<code>usdocker</code>](#module_usdocker)  
<a name="Config"></a>

## Config
Class to handle the configuration of the script

**Kind**: global class  

* [Config](#Config)
    * [new Config(script, alternateHome)](#new_Config_new)
    * [.reload()](#Config+reload)
    * [.save()](#Config+save)
    * [.copyToUserDir(source)](#Config+copyToUserDir) ⇒ <code>boolean</code>
    * [.copyToDataDir(source)](#Config+copyToDataDir) ⇒ <code>boolean</code>
    * [.getUserDir(name)](#Config+getUserDir) ⇒ <code>string</code>
    * [.getDataDir()](#Config+getDataDir) ⇒ <code>string</code>
    * [.set(key, value)](#Config+set)
    * [.setEmpty(key, value)](#Config+setEmpty)
    * [.get(key, defaultValue)](#Config+get) ⇒ <code>\*</code>
    * [.clear(key)](#Config+clear)
    * [.dump()](#Config+dump)
    * [.getLocalTimeZone()](#Config+getLocalTimeZone) ⇒ <code>string</code>

<a name="new_Config_new"></a>

### new Config(script, alternateHome)
Constructor


| Param | Type | Description |
| --- | --- | --- |
| script | <code>string</code> | The script |
| alternateHome | <code>string</code> | (optional) Setup an alternate home directory |

<a name="Config+reload"></a>

### config.reload()
Force reload from disk

**Kind**: instance method of [<code>Config</code>](#Config)  
<a name="Config+save"></a>

### config.save()
Save configuration to disk

**Kind**: instance method of [<code>Config</code>](#Config)  
<a name="Config+copyToUserDir"></a>

### config.copyToUserDir(source) ⇒ <code>boolean</code>
Copy a folder from the script directory to the user directory

**Kind**: instance method of [<code>Config</code>](#Config)  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>string</code> | Path |

<a name="Config+copyToDataDir"></a>

### config.copyToDataDir(source) ⇒ <code>boolean</code>
Copy a folder from the script directory to the data directory

**Kind**: instance method of [<code>Config</code>](#Config)  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>string</code> | Path |

<a name="Config+getUserDir"></a>

### config.getUserDir(name) ⇒ <code>string</code>
Get the full path of the folder "name" in the user directory area

**Kind**: instance method of [<code>Config</code>](#Config)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

<a name="Config+getDataDir"></a>

### config.getDataDir() ⇒ <code>string</code>
Get the full path of the data directory

**Kind**: instance method of [<code>Config</code>](#Config)  
<a name="Config+set"></a>

### config.set(key, value)
Set a key/value pair into the config and save to the disk

**Kind**: instance method of [<code>Config</code>](#Config)  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 
| value | <code>string</code> \| <code>array</code> | 

<a name="Config+setEmpty"></a>

### config.setEmpty(key, value)
Set a key/value pair into the config ONLY if does not exists and do nothing if exists.

**Kind**: instance method of [<code>Config</code>](#Config)  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 
| value | <code>string</code> \| <code>array</code> | 

<a name="Config+get"></a>

### config.get(key, defaultValue) ⇒ <code>\*</code>
Get a value defined by the key or the value defined in defaultValue if not exists

**Kind**: instance method of [<code>Config</code>](#Config)  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 
| defaultValue | <code>string</code> \| <code>array</code> | 

<a name="Config+clear"></a>

### config.clear(key)
Remove a key

**Kind**: instance method of [<code>Config</code>](#Config)  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 

<a name="Config+dump"></a>

### config.dump()
Dump the config

**Kind**: instance method of [<code>Config</code>](#Config)  
<a name="Config+getLocalTimeZone"></a>

### config.getLocalTimeZone() ⇒ <code>string</code>
Get the time zone of the system

**Kind**: instance method of [<code>Config</code>](#Config)  
<a name="DockerListWrapper"></a>

## DockerListWrapper
Wrapper for the "docker list" command line

**Kind**: global class  

* [DockerListWrapper](#DockerListWrapper)
    * [new DockerListWrapper(configGlobal)](#new_DockerListWrapper_new)
    * [.getAll(callback)](#DockerListWrapper+getAll)
    * [.getRunning(callback)](#DockerListWrapper+getRunning)
    * [.get(limit, filters, callback)](#DockerListWrapper+get)

<a name="new_DockerListWrapper_new"></a>

### new DockerListWrapper(configGlobal)
Constructor


| Param | Type |
| --- | --- |
| configGlobal | [<code>Config</code>](#Config) | 

<a name="DockerListWrapper+getAll"></a>

### dockerListWrapper.getAll(callback)
Get all containers (including the stopped)

**Kind**: instance method of [<code>DockerListWrapper</code>](#DockerListWrapper)  

| Param |
| --- |
| callback | 

<a name="DockerListWrapper+getRunning"></a>

### dockerListWrapper.getRunning(callback)
Get only the running containers

**Kind**: instance method of [<code>DockerListWrapper</code>](#DockerListWrapper)  

| Param |
| --- |
| callback | 

<a name="DockerListWrapper+get"></a>

### dockerListWrapper.get(limit, filters, callback)
Get a container based on the filter

**Kind**: instance method of [<code>DockerListWrapper</code>](#DockerListWrapper)  

| Param | Type | Description |
| --- | --- | --- |
| limit | <code>integer</code> | The maximum number of results |
| filters | <code>string</code> | The filter '{"label": ["staging","env=green"]}' |
| callback |  |  |

<a name="DockerRunWrapper"></a>

## DockerRunWrapper
Wrapper for the "docker run" command line

**Kind**: global class  

* [DockerRunWrapper](#DockerRunWrapper)
    * [new DockerRunWrapper(configGlobal)](#new_DockerRunWrapper_new)
    * [.port(host, container)](#DockerRunWrapper+port) ⇒ <code>Array</code> \| [<code>DockerRunWrapper</code>](#DockerRunWrapper)
    * [.volume(host, container)](#DockerRunWrapper+volume) ⇒ <code>Array</code> \| [<code>DockerRunWrapper</code>](#DockerRunWrapper)
    * [.link(source, target)](#DockerRunWrapper+link) ⇒ [<code>DockerRunWrapper</code>](#DockerRunWrapper)
    * [.env(variable, value)](#DockerRunWrapper+env) ⇒ <code>Array</code> \| [<code>DockerRunWrapper</code>](#DockerRunWrapper)
    * [.dockerParamSet(param)](#DockerRunWrapper+dockerParamSet) ⇒ <code>Array</code> \| [<code>DockerRunWrapper</code>](#DockerRunWrapper)
    * [.dockerParamAdd(param)](#DockerRunWrapper+dockerParamAdd) ⇒ <code>Array</code> \| [<code>DockerRunWrapper</code>](#DockerRunWrapper)
    * [.isDetached(value)](#DockerRunWrapper+isDetached) ⇒ <code>boolean</code> \| [<code>DockerRunWrapper</code>](#DockerRunWrapper)
    * [.isInteractive(value)](#DockerRunWrapper+isInteractive) ⇒ <code>boolean</code> \| [<code>DockerRunWrapper</code>](#DockerRunWrapper)
    * [.isRemove(value)](#DockerRunWrapper+isRemove) ⇒ <code>boolean</code> \| [<code>DockerRunWrapper</code>](#DockerRunWrapper)
    * [.containerName(value)](#DockerRunWrapper+containerName) ⇒ <code>string</code> \| [<code>DockerRunWrapper</code>](#DockerRunWrapper)
    * [.imageName(value)](#DockerRunWrapper+imageName) ⇒ <code>string</code> \| [<code>DockerRunWrapper</code>](#DockerRunWrapper)
    * [.commandParam(param)](#DockerRunWrapper+commandParam) ⇒ <code>Array</code> \| [<code>DockerRunWrapper</code>](#DockerRunWrapper)
    * [.buildConsole(addLinks)](#DockerRunWrapper+buildConsole) ⇒ <code>Array</code>
    * [.buildApi()](#DockerRunWrapper+buildApi) ⇒ <code>Array</code>

<a name="new_DockerRunWrapper_new"></a>

### new DockerRunWrapper(configGlobal)
Construtor


| Param | Type |
| --- | --- |
| configGlobal | [<code>Config</code>](#Config) | 

<a name="DockerRunWrapper+port"></a>

### dockerRunWrapper.port(host, container) ⇒ <code>Array</code> \| [<code>DockerRunWrapper</code>](#DockerRunWrapper)
Map the port. Equals to -p parameter

**Kind**: instance method of [<code>DockerRunWrapper</code>](#DockerRunWrapper)  

| Param | Type | Description |
| --- | --- | --- |
| host | <code>int</code> | Port on host (if empty returns the string "host:container" |
| container | <code>int</code> | Port on container |

<a name="DockerRunWrapper+volume"></a>

### dockerRunWrapper.volume(host, container) ⇒ <code>Array</code> \| [<code>DockerRunWrapper</code>](#DockerRunWrapper)
Map the volume. Equals to -v parameter

**Kind**: instance method of [<code>DockerRunWrapper</code>](#DockerRunWrapper)  

| Param | Type | Description |
| --- | --- | --- |
| host | <code>string</code> | Path on the host (if empty returns the string "host:container") |
| container | <code>string</code> | Path on container |

<a name="DockerRunWrapper+link"></a>

### dockerRunWrapper.link(source, target) ⇒ [<code>DockerRunWrapper</code>](#DockerRunWrapper)
Create a link to an existing docker container. Equals to --link parameter

**Kind**: instance method of [<code>DockerRunWrapper</code>](#DockerRunWrapper)  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>string</code> | Container name |
| target | <code>string</code> | Link name |

<a name="DockerRunWrapper+env"></a>

### dockerRunWrapper.env(variable, value) ⇒ <code>Array</code> \| [<code>DockerRunWrapper</code>](#DockerRunWrapper)
Set an environment variable on the container. Equals to --env parameter

**Kind**: instance method of [<code>DockerRunWrapper</code>](#DockerRunWrapper)  

| Param | Type | Description |
| --- | --- | --- |
| variable | <code>string</code> | (if empty returns the string "variable=value") |
| value | <code>string</code> |  |

<a name="DockerRunWrapper+dockerParamSet"></a>

### dockerRunWrapper.dockerParamSet(param) ⇒ <code>Array</code> \| [<code>DockerRunWrapper</code>](#DockerRunWrapper)
**Kind**: instance method of [<code>DockerRunWrapper</code>](#DockerRunWrapper)  

| Param |
| --- |
| param | 

<a name="DockerRunWrapper+dockerParamAdd"></a>

### dockerRunWrapper.dockerParamAdd(param) ⇒ <code>Array</code> \| [<code>DockerRunWrapper</code>](#DockerRunWrapper)
**Kind**: instance method of [<code>DockerRunWrapper</code>](#DockerRunWrapper)  

| Param |
| --- |
| param | 

<a name="DockerRunWrapper+isDetached"></a>

### dockerRunWrapper.isDetached(value) ⇒ <code>boolean</code> \| [<code>DockerRunWrapper</code>](#DockerRunWrapper)
Defines if the container will be detached. Equals to -d

**Kind**: instance method of [<code>DockerRunWrapper</code>](#DockerRunWrapper)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>boolean</code> | (if empty returns true or false) |

<a name="DockerRunWrapper+isInteractive"></a>

### dockerRunWrapper.isInteractive(value) ⇒ <code>boolean</code> \| [<code>DockerRunWrapper</code>](#DockerRunWrapper)
Defines if the container will be a terminal interactive. Equals to -it parameter.

**Kind**: instance method of [<code>DockerRunWrapper</code>](#DockerRunWrapper)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>boolean</code> | (if empty returns true or false) |

<a name="DockerRunWrapper+isRemove"></a>

### dockerRunWrapper.isRemove(value) ⇒ <code>boolean</code> \| [<code>DockerRunWrapper</code>](#DockerRunWrapper)
Defines if the container removed on the end. Equals to --rm parameter.

**Kind**: instance method of [<code>DockerRunWrapper</code>](#DockerRunWrapper)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>boolean</code> | (if empty returns true or false) |

<a name="DockerRunWrapper+containerName"></a>

### dockerRunWrapper.containerName(value) ⇒ <code>string</code> \| [<code>DockerRunWrapper</code>](#DockerRunWrapper)
Defines the container name. Equals to --name parameter.

**Kind**: instance method of [<code>DockerRunWrapper</code>](#DockerRunWrapper)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | (if empty returns the container name) |

<a name="DockerRunWrapper+imageName"></a>

### dockerRunWrapper.imageName(value) ⇒ <code>string</code> \| [<code>DockerRunWrapper</code>](#DockerRunWrapper)
Defines the image name.

**Kind**: instance method of [<code>DockerRunWrapper</code>](#DockerRunWrapper)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | (if empty returns the image name) |

<a name="DockerRunWrapper+commandParam"></a>

### dockerRunWrapper.commandParam(param) ⇒ <code>Array</code> \| [<code>DockerRunWrapper</code>](#DockerRunWrapper)
Defines the command paramters.

**Kind**: instance method of [<code>DockerRunWrapper</code>](#DockerRunWrapper)  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>string</code> | (if empty returns the array of parameters) |

<a name="DockerRunWrapper+buildConsole"></a>

### dockerRunWrapper.buildConsole(addLinks) ⇒ <code>Array</code>
Return the full command line

**Kind**: instance method of [<code>DockerRunWrapper</code>](#DockerRunWrapper)  

| Param | Type | Description |
| --- | --- | --- |
| addLinks | <code>boolean</code> | if true automatically add the links of running container to the script. |

<a name="DockerRunWrapper+buildApi"></a>

### dockerRunWrapper.buildApi() ⇒ <code>Array</code>
Returns the object to be used in the docker API.

**Kind**: instance method of [<code>DockerRunWrapper</code>](#DockerRunWrapper)  
<a name="DockerWrapper"></a>

## DockerWrapper
Abstract class for implement docker wrapper class

**Kind**: global class  

* [DockerWrapper](#DockerWrapper)
    * [new DockerWrapper(configGlobal)](#new_DockerWrapper_new)
    * [.host(hostName)](#DockerWrapper+host) ⇒ <code>\*</code>
    * [.getInstance()](#DockerWrapper+getInstance) ⇒ <code>Docker</code>

<a name="new_DockerWrapper_new"></a>

### new DockerWrapper(configGlobal)
Constructor


| Param | Type |
| --- | --- |
| configGlobal | [<code>Config</code>](#Config) | 

<a name="DockerWrapper+host"></a>

### dockerWrapper.host(hostName) ⇒ <code>\*</code>
Defines the docker host. Equals to -H parameter.

**Kind**: instance method of [<code>DockerWrapper</code>](#DockerWrapper)  

| Param | Type | Description |
| --- | --- | --- |
| hostName | <code>string</code> | (if empty return the host name) |

<a name="DockerWrapper+getInstance"></a>

### dockerWrapper.getInstance() ⇒ <code>Docker</code>
Static method to return an instance of a DockerWrapper

**Kind**: instance method of [<code>DockerWrapper</code>](#DockerWrapper)  
<a name="Output"></a>

## Output
Handle the output of the modules instead to console.log

**Kind**: global class  

* [Output](#Output)
    * [new Output(verbosity)](#new_Output_new)
    * [.print(normal, verbose)](#Output+print)
    * [.printErr(err)](#Output+printErr)

<a name="new_Output_new"></a>

### new Output(verbosity)
Constructor


| Param | Type | Description |
| --- | --- | --- |
| verbosity | <code>boolean</code> | True is verbosity |

<a name="Output+print"></a>

### output.print(normal, verbose)
Print a message according to the verbosity.

**Kind**: instance method of [<code>Output</code>](#Output)  

| Param | Type | Description |
| --- | --- | --- |
| normal | <code>string</code> | Print this string if verbositity is false |
| verbose | <code>string</code> | Print this string if verbositity is true. If null, return the "normal" string |

<a name="Output+printErr"></a>

### output.printErr(err)
Output the Error.message. If verbosity is true, return the stack trace also

**Kind**: instance method of [<code>Output</code>](#Output)  

| Param | Type |
| --- | --- |
| err | <code>Error</code> | 

<a name="ScriptContainer"></a>

## ScriptContainer
Handle where to locate and how to load and run the string

**Kind**: global class  

* [ScriptContainer](#ScriptContainer)
    * [new ScriptContainer(config, search)](#new_ScriptContainer_new)
    * [.isLoaded()](#ScriptContainer+isLoaded) ⇒ <code>boolean</code>
    * [.load(force)](#ScriptContainer+load) ⇒ <code>true</code> \| <code>false</code> \| <code>null</code>
    * [.loadModules(item)](#ScriptContainer+loadModules)
    * [.existsScript(script)](#ScriptContainer+existsScript) ⇒ <code>boolean</code>
    * [.availableScripts()](#ScriptContainer+availableScripts) ⇒ <code>Array</code>
    * [.availableCommands(script)](#ScriptContainer+availableCommands) ⇒ <code>\*</code>
    * [.getScript(script)](#ScriptContainer+getScript) ⇒ <code>Object</code> \| <code>\*</code>
    * [.cc(name)](#ScriptContainer+cc)

<a name="new_ScriptContainer_new"></a>

### new ScriptContainer(config, search)
Construtor


| Param | Type | Description |
| --- | --- | --- |
| config | [<code>Config</code>](#Config) |  |
| search | <code>string</code> | (optional) |

<a name="ScriptContainer+isLoaded"></a>

### scriptContainer.isLoaded() ⇒ <code>boolean</code>
Check if the script container data is loaded

**Kind**: instance method of [<code>ScriptContainer</code>](#ScriptContainer)  
<a name="ScriptContainer+load"></a>

### scriptContainer.load(force) ⇒ <code>true</code> \| <code>false</code> \| <code>null</code>
Load the string container data from the cache or create one if does not exists.

**Kind**: instance method of [<code>ScriptContainer</code>](#ScriptContainer)  
**Returns**: <code>true</code> \| <code>false</code> \| <code>null</code> - True if it is created; False if it is loaded; null if get from cache.  

| Param | Type | Description |
| --- | --- | --- |
| force | <code>boolean</code> | If force always will be recreate the cache. |

<a name="ScriptContainer+loadModules"></a>

### scriptContainer.loadModules(item)
Search for a module and create the instance.

**Kind**: instance method of [<code>ScriptContainer</code>](#ScriptContainer)  

| Param |
| --- |
| item | 

<a name="ScriptContainer+existsScript"></a>

### scriptContainer.existsScript(script) ⇒ <code>boolean</code>
Check if the script exists

**Kind**: instance method of [<code>ScriptContainer</code>](#ScriptContainer)  

| Param | Type |
| --- | --- |
| script | <code>string</code> | 

<a name="ScriptContainer+availableScripts"></a>

### scriptContainer.availableScripts() ⇒ <code>Array</code>
Return the list of available scripts

**Kind**: instance method of [<code>ScriptContainer</code>](#ScriptContainer)  
<a name="ScriptContainer+availableCommands"></a>

### scriptContainer.availableCommands(script) ⇒ <code>\*</code>
Return the list of the available commands in the script;

**Kind**: instance method of [<code>ScriptContainer</code>](#ScriptContainer)  

| Param | Type |
| --- | --- |
| script | <code>string</code> | 

<a name="ScriptContainer+getScript"></a>

### scriptContainer.getScript(script) ⇒ <code>Object</code> \| <code>\*</code>
Load a script into the memory

**Kind**: instance method of [<code>ScriptContainer</code>](#ScriptContainer)  

| Param | Type |
| --- | --- |
| script | <code>string</code> | 

<a name="ScriptContainer+cc"></a>

### scriptContainer.cc(name)
Convert a parameter 'name-second' into a camel case "nameSecond"

**Kind**: instance method of [<code>ScriptContainer</code>](#ScriptContainer)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

