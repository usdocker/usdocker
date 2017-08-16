## Modules

<dl>
<dt><a href="#module_usdockerhelper">usdockerhelper</a></dt>
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

<a name="module_usdockerhelper"></a>

## usdockerhelper
Helper class to run docker commands/action


* [usdockerhelper](#module_usdockerhelper)
    * [.pull(image, callback)](#module_usdockerhelper.pull)
    * [.up(dockerRunWrapper)](#module_usdockerhelper.up)
    * [.run(sc, script, command, setup)](#module_usdockerhelper.run)
    * [.runUsingApi(dockerrunwrapper)](#module_usdockerhelper.runUsingApi)
    * [.runUsingCli(dockerrunwrapper)](#module_usdockerhelper.runUsingCli)

<a name="module_usdockerhelper.pull"></a>

### usdockerhelper.pull(image, callback)
Pull an docker image

**Kind**: static method of [<code>usdockerhelper</code>](#module_usdockerhelper)  

| Param | Type | Description |
| --- | --- | --- |
| image | <code>string</code> | The image name |
| callback |  | The callback function |

<a name="module_usdockerhelper.up"></a>

### usdockerhelper.up(dockerRunWrapper)
**Kind**: static method of [<code>usdockerhelper</code>](#module_usdockerhelper)  

| Param | Type |
| --- | --- |
| dockerRunWrapper | [<code>DockerRunWrapper</code>](#DockerRunWrapper) | 

<a name="module_usdockerhelper.run"></a>

### usdockerhelper.run(sc, script, command, setup)
**Kind**: static method of [<code>usdockerhelper</code>](#module_usdockerhelper)  

| Param | Type |
| --- | --- |
| sc | [<code>ScriptContainer</code>](#ScriptContainer) | 
| script | [<code>Config</code>](#Config) | 
| command | <code>string</code> | 
| setup | <code>boolean</code> | 

<a name="module_usdockerhelper.runUsingApi"></a>

### usdockerhelper.runUsingApi(dockerrunwrapper)
**Kind**: static method of [<code>usdockerhelper</code>](#module_usdockerhelper)  

| Param | Type |
| --- | --- |
| dockerrunwrapper | [<code>DockerRunWrapper</code>](#DockerRunWrapper) | 

<a name="module_usdockerhelper.runUsingCli"></a>

### usdockerhelper.runUsingCli(dockerrunwrapper)
**Kind**: static method of [<code>usdockerhelper</code>](#module_usdockerhelper)  

| Param | Type |
| --- | --- |
| dockerrunwrapper | [<code>DockerRunWrapper</code>](#DockerRunWrapper) | 

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
    * [.port(host, container)](#DockerRunWrapper+port) ⇒ <code>string</code>
    * [.volume(host, container)](#DockerRunWrapper+volume) ⇒ <code>\*</code>
    * [.link(source, target)](#DockerRunWrapper+link) ⇒ [<code>DockerRunWrapper</code>](#DockerRunWrapper)
    * [.env(variable, value)](#DockerRunWrapper+env) ⇒ <code>\*</code>
    * [.dockerParam(param)](#DockerRunWrapper+dockerParam) ⇒ <code>\*</code>
    * [.isDetached(value)](#DockerRunWrapper+isDetached) ⇒ <code>\*</code>
    * [.isInteractive(value)](#DockerRunWrapper+isInteractive) ⇒ <code>\*</code>
    * [.isRemove(value)](#DockerRunWrapper+isRemove) ⇒ <code>\*</code>
    * [.containerName(value)](#DockerRunWrapper+containerName) ⇒ <code>\*</code>
    * [.imageName(value)](#DockerRunWrapper+imageName) ⇒ <code>\*</code>
    * [.commandParam(param)](#DockerRunWrapper+commandParam) ⇒ <code>\*</code>
    * [.buildConsole(addLinks)](#DockerRunWrapper+buildConsole) ⇒ <code>Array</code>
    * [.buildApi()](#DockerRunWrapper+buildApi) ⇒ <code>Array</code>

<a name="new_DockerRunWrapper_new"></a>

### new DockerRunWrapper(configGlobal)
Construtor


| Param | Type |
| --- | --- |
| configGlobal | [<code>Config</code>](#Config) | 

<a name="DockerRunWrapper+port"></a>

### dockerRunWrapper.port(host, container) ⇒ <code>string</code>
Map the port. Equals to -p parameter

**Kind**: instance method of [<code>DockerRunWrapper</code>](#DockerRunWrapper)  

| Param | Type | Description |
| --- | --- | --- |
| host | <code>int</code> | Port on host (if empty returns the string "host:container" |
| container | <code>int</code> | Port on container |

<a name="DockerRunWrapper+volume"></a>

### dockerRunWrapper.volume(host, container) ⇒ <code>\*</code>
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

### dockerRunWrapper.env(variable, value) ⇒ <code>\*</code>
Set an environment variable on the container. Equals to --env parameter

**Kind**: instance method of [<code>DockerRunWrapper</code>](#DockerRunWrapper)  

| Param | Type | Description |
| --- | --- | --- |
| variable | <code>string</code> | (if empty returns the string "variable=value") |
| value | <code>string</code> |  |

<a name="DockerRunWrapper+dockerParam"></a>

### dockerRunWrapper.dockerParam(param) ⇒ <code>\*</code>
**Kind**: instance method of [<code>DockerRunWrapper</code>](#DockerRunWrapper)  

| Param |
| --- |
| param | 

<a name="DockerRunWrapper+isDetached"></a>

### dockerRunWrapper.isDetached(value) ⇒ <code>\*</code>
Defines if the container will be detached. Equals to -d

**Kind**: instance method of [<code>DockerRunWrapper</code>](#DockerRunWrapper)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>boolean</code> | (if empty returns true or false) |

<a name="DockerRunWrapper+isInteractive"></a>

### dockerRunWrapper.isInteractive(value) ⇒ <code>\*</code>
Defines if the container will be a terminal interactive. Equals to -it parameter.

**Kind**: instance method of [<code>DockerRunWrapper</code>](#DockerRunWrapper)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>boolean</code> | (if empty returns true or false) |

<a name="DockerRunWrapper+isRemove"></a>

### dockerRunWrapper.isRemove(value) ⇒ <code>\*</code>
Defines if the container removed on the end. Equals to --rm parameter.

**Kind**: instance method of [<code>DockerRunWrapper</code>](#DockerRunWrapper)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>boolean</code> | (if empty returns true or false) |

<a name="DockerRunWrapper+containerName"></a>

### dockerRunWrapper.containerName(value) ⇒ <code>\*</code>
Defines the container name. Equals to --name parameter.

**Kind**: instance method of [<code>DockerRunWrapper</code>](#DockerRunWrapper)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | (if empty returns the container name) |

<a name="DockerRunWrapper+imageName"></a>

### dockerRunWrapper.imageName(value) ⇒ <code>\*</code>
Defines the image name.

**Kind**: instance method of [<code>DockerRunWrapper</code>](#DockerRunWrapper)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | (if empty returns the image name) |

<a name="DockerRunWrapper+commandParam"></a>

### dockerRunWrapper.commandParam(param) ⇒ <code>\*</code>
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

