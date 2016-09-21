![](https://img.shields.io/npm/v/quilk.svg) ![](https://img.shields.io/npm/dm/quilk.svg)

#quilk
Est. 4th Sept. 2016
A builder and watcher with speed. No complex build configuration file required, just a simple JSON.

---

### Still a work in progress
The version number will be moved to 1.0.0 once I deem this stable.

### Last updates
- Moved to the simple ansi-html in the email module as it has zero dependencies.
- Standardised the logging from the modules.
- Created a new global entity, die. This if called during a release will run the error block of the release if it exists before process.exit(); so basically you now know wher stuff breaks on a server for example.
- Extended the release runner, upon completion the runner will now run a separate block, eg call a webhook or send an email.
- Just added the webhook module.
- Just added the [email](#email-the-quilk-logs) module. This is a direct mapping to the popular node-mailer package. We found when using quilk that it would be nice when a build on the testing server failed or succeeded.. just configure some email details and plonk a use of the email module in a release post block and hey presto we all now know instantly when a build failed (it also captures all the console logs and includes these in the email too). See the [kitchen sink quilk.json](#example-kitchen-sink-quilkjson) for more.
- The email module can be configured with hard-coded values or environment variables, see the kitchen sink json for examples
- The release commands can now be 1 of 3 formats. A straight up exec, pass as a simple string. A spawn, each bit of output is dumped to the console as and when it is outputted, pass a numeric array with the first param being the program. Modules, just as before... see the kitchen sink release block for an exmaple of all 3.
- 3rd party quilk modules, either private (relative to current project level) or public (package from npm). Take a look at the [Custom modules](#custom-modules) for more info.

### Next
- Add support for sendmail in the email module
- Improve the docs
- Write some tests

### Known bug(s)
- Very minor. If you set the headers of your linux box to secure (see Lynis) the rsync module spits out a red error. It is not an error and can be ignored, not sure how to differentiate between it and a real error at the moment as they both come through the same channel :/ Does not harm functionality though.

### Index
*  [Intro](#intro)
*  [Install](#install)
*  [Getting started](#getting-started)
*  [Example single run](#example-single-run)
*  [Example run then watch](#example-run-then-watch)
*  [Example run for live](#example-run-for-live)
*  [How it works](#how-it-works)
*  [Custom modules](#custom-modules)
*  [Using quilk for release](#using-quilk-for-release)
*  [Email the quilk logs](#email-the-quilk-logs)
*  [Example kitchen sink quilk.json](#example-kitchen-sink-quilkjson)
*  [Example browserifyMain.js file](#example-browserifymainjs-file-which-requires-other-modules)
*  [Which notifier to use](#which-notifier-to-use)


## Intro
Why did I go ahead and build yet another module runner designed to compile SASS and JS files and rsync... in short, speed. I needed a super lightweight solution that worked fast on both low spec machines with a HDD, as well as the high spec with SSD machines. The current tools available were killing the build speed on an i5 HDD machine, especially when throwing watchers plus an IDE into the mix... a lot of time sitting and waiting.

Quilk began as a single script which utilized the popular node-sass npm package plus the nice and light concat-files npm package together with the snappy chokidar file watcher. The result was a working solution for lower spec machines that was still rapid fast and didn't require `npm install` to download the entire internet.

As quilk grew and was being used in more projects, the configuration nature of quilk started to emerge. Using the same script on different projects but with just altering a few lines of a JSON file meant projects were setup in no time, and it was no longer possible to create a whacky build file... Roll forward to today and I use quilk in many projects using most of the std tools from sass to less to browserify.

I only wrapped this into an "official" npm package recently to allow easier installation on other machines other than my own.

## Install
Quilk is not installed as a dependency in a package.json file, but installed globally:
`npm install -g quilk`

## Getting started
First up, I don't enjoy typing dashes before cli args, if you do that is fine they will still work but, the quilk cli commands also work without, eg the following all map to the same thing.. help: `quilk help` `quilk -help` `quilk --help`

Create your base `quilk.json` file by running from the root of your project (or copying from another project):
```
 quilk init
```
This will bootstrap the current directory with a quilk.json file configured to run the `just_for_fun` module. After the init has finished you can take quilk for a test drive  by typing `quilk`, this will take the developer in the quilk.json named default and pass to the modules the quilk.json is configured to run, which in this case is just the fun run module (a different developer would be accessed with `quilk d=<name>` or `quilk developer=<name>`)

For help on a specific module, find the module name (see lower down in the how it works section)
 ```
 quilk help module=<module>
 ```

## Example single run
With your quilk.json configured you can kick off a single run with:
`quilk d=john`

## Example run then watch
Adding `watch`into the mix will instruct quilk to watch your files and re-run the modules in the modules array again after a change (either a new file or change or removal). The watcher is chokidar:
`quilk d=john watch`

## Example run for live
In the quilk.json you will see a `release_commands_or_modules` section. Here you can add commands or modules to be run, note the pre and post section, this just means things run before the usual modules array or after. EG you may wish to run a bower install on an environment before running the std modules array, when completing you will likely wish to minify and compress the js and css files.
`quilk release=live`

## How it works
Quilk works by taking the project relevant settings and data from a quilk.json file and feeding that said data into prebuilt modules. These said modules come packaged with quilk and do all the basic things you might expect, for example compiling .scss files or finding then concatenating javascript files etc.

When you start quilk, the runner simply loops and runs each module it finds in the modules array in the quilk.json one by one until exhaustion.

The base modules quilk comes with handle the majority of tasks required to compile and build modern day web applications and the quilk.json can be configured in a matter of minutes. However, should you require something that is outside the std modules then you can simply write your own.

1.  **The 9 modules** packaged with quilk and ready to go (see the kitchen sink example quilk.json):
    1. **browserify_bundle**: This will build a bundle.js from other js modules. A must for when building nodeJs web applications, use select server side code at the client and the client code at the server, less code to write.
    1. **js_find**: This will create a single js file based on js files it finds within an array of paths you provide. You may also state which files must be included at the top of the generated file.
    1. **js_fixed**: A simplified version of js_find, provide a static list of files and the module will simply concat them all together in a single js file.
    1. **less_std**: A standard module to build css files. Provide the entry point and output point and the module will handle the rest.
    1. **css_fixed**: A simple concat module, supply it paths from the root of your project and output will be one big css file. Perfect for including css from 3rd parties eg via bower.
    1. **sass_std**: A standard module to build css from sass files. The same as the less_std, provide the in and out and the module handles the rest. It being sass of course results in a much much faster time to compile.
    1. **sass_find**: Slightly different from the sass_find, this module will find sass files in paths you provide and create a single sass file, ever so slightly slower than the sass_std, but which ever floats your boat :)
    1. **rsync**: Not everyone is a fan of overheating your local machine and burning it into the ground before it is due just so they can claim they can work on the bus. If this is you and you want ot ensure a dev env that is identical for everyone rsync is for you. Rsync only syncs the files that have changed since the last time it ran, opposed to all files every time. If you are using windows you would want to look at cygwin tools or cwrsync. This rsync module just uses nodejs 'require('child_process').spawn'. If you see something in rsync you want to use, just add it to the `set` array, see the kitchen sink for an example. NB the set array can either be global or developer specific
    1. **node_minify**: This is a direct mapping to the popular node_minify npm packge. 
3.  **Config data**  See the full kitchen sink example below.
4.  **Dont watch** When using the watch option ensure that you instruct which file to not watch, `dont_watch`.
    The `dont_watch` option is quilk.json is passed to chokidar as directories and exact files to not trigger on. EG should you build a css file from sass you don't want to trigger chokidar to run all the modules again when it spots a change in the said css file ie ending up in an infinite loop.
5.  **Developers block** This can be as general or as granular as your like. As you can see from the example, this also contains developer specifics for the rsync module and notification popups (not everyone wants to see the notification ballon).

## Custom modules
Custom modules allow you to basically do anything you want with whatever you want. Currently there is no bundled modules in quilk with babelfy for example. If this is something you would want, a custom module is what you need... but you get the idea.

There are two types of custom modules available to use:
1.  A 3rd party npm package installed to you project in the usual node_modules folder, included in the package.json file as a dependency. 
2.  Your own project custom module kept in a specific folder within your project titled `quilk_modules`.

For a module to work with the quilk runner you just need to expose a function called `run`. If you are writing a 3rd party module for others to use then the main file of the npm package should export an object with a `run` function at the top level. For example if the main file of your 3rd party npm package was `index.js` then this would have to contain something like this (the module would look exactly the same if it was a custom project module in the `quilk_modules` of your project):
```
module.export = { 
    run: function( next ){ 
        /* the codey good stuff */ 
            //put some good ingredients here please
        /* when done call next */
        next();
    } 
};
``` 
Obviously this run function can do all the donkey work of the module of can just be a gateway to something bigger and more complex, you decide.

Here is a list of all the goodies you have access to in a module
1.  **global.current_module**: This will be the current module object in the quilk.json. There is no required format, but see the example kitchen sink below for a starter. This is basially where you chunk in your project specific data. A little tip, if your module will write a file to disk, if you put this in the json as the `target` then the runner will automatically create the folders for you (checkout the kitchen sink json and note how they all have a `target` path).
1.  **global.desktopNotify**: This function accepts 2 params, a title and message body. It will be actioned if the users notifications are turned on in the quilk.json file.
1.  **global.chokidarFileChangePath**: If you are running quilk with watch then the current file that was changed will be in this variable. Handy for knowing when to skip the current module.. eg the less_std doesn't waste time building the less file if no less file was not altered.
1.  **global.cliArgs**: All the command line arguments are stored here, if you want your module to pivot by cli args then this is where to look.    
1.  **next**: The one and only argument that will be passed to each module is a callback. This will be the next module to be run after the current has finished. This is quite similar to expressJS's next functions in middlewares.
    
To create an example custom module run from the cli at the root of your project:
```
quilk init example_module
```

Example custom module in the quilk.json. To call a custom quilk module, if the module is a 3rd party from npm just enter the :
```
{
  "modules" : [
    {
      "name": "My module running",
      "module" : "my_module",
      "path_input": "/private/path/",
      "path_output": "/public/path/"
    },
    ... rest of the modules array
```  

Here is a simple 3rd party quilk module I built as an example:  https://www.npmjs.com/package/quilk-public-example-3rd-party-module

Add it to the package.json of your project, and include `quilk-public-example-3rd-party-module` in your quilk.json module array eg:
```
{
  "modules" : [
    {
      "name": "test 3rd party",
      "module": "quilk-public-example-3rd-party-module"
    },
    ...
```

If you take a look at the code in `quilk-public-example-3rd-party-module` you will see it requires a module that is not part of the quilk npm package.. yet it still works without a hitch... this has only just been tested on npm 3.10.3. This may or may not break in npm < 3...  

## Using quilk for release
You can configure quilk to run additional modules and commands for specific environments, eg a dev server where you want to test compressed and obfusicated code.

This is acheived with the `release_commands_or_modules` block of the quilk json. The release block can contain as many different releases as you like, eg "dev", "staging", "live".

Each block can contain either or all of the following:
1.  `pre` this is stuff that will be called before the std quilk modules.
1.  `post` this is stuff that will be called after the std quilk modules.
1.  `complete` this is stuff that will be called after the `post` and with zero errors.
1.  `error` this will be called when there is an error found in the pre, std modules, post or even complete.

Please see the kicthen sink json for a fuller example:  [Example kitchen sink quilk.json](#example-kitchen-sink-quilkjson)


## Webooks
You can configure a release object to post the quilk output to a url... aka a webhook. Just provide the url and opening message and you good to go.
EG:
```
   ...
    "error" : [{
        "name" : "Pinging slack",
        "module" : "webhook",
        "message_start" : "Error building 007 server, here are the quilk logs",
        "url" : "https://hooks.slack.com/services/11111111/000000000/000000000003"
      }]
   ...   
```
If you need to pass any basic auth credential to the webhook you will need to add an additional 2 params, EG:
```
   ...
    "error" : [{
        "name" : "Pinging secret service",
        "module" : "webhook",
        "message_start" : "Error building 007 server, here are the quilk logs",
        "url" : "https://hooks.secret.com/services/11111111/000000000/000000000003",
        "auth_username": "bob",
        "auth_password": "has a secure password"
      }]
   ...   
```


## Email the quilk logs
You can make use of the email in-built module to send out an email message, add include_log as true and then all the console log output will be captured in full html syntax with colour. 

Here is an example of using a predefined email config block that will be triggered as the last module run in the live release array:
```
  ...
  "release_commands_or_modules": {
    "live":{
      "post":[{
        "name": "Email total output",
        "module": "email",
        "config": "dev",
        "email_subject": "Logs from quilk build on live",
        "email_message": "The quilk build for live has just finished, below the log output.",
        "include_log": true
      }]
    },
    ...
```

Note in the email the config section with the string 'main', this refers to a global email block eg:
  ```
  "email": {
    "main": {
      "email_to" : ["devs@some-email.net"],
      "email_from" : {
        "name": "quilk",
        "email": "john@gmail.com"
      },
      "transport_options": {
        "environment_variables": false,
        "host": "smtp.gmail.com",
        "port": 465,
        "secure": true,
        "auth": {
          "user": "john@gmail.com",
          "pass": "password"
        }
      }
    }
  }
  ```

You can as many blocks into this area as you want. You may quilk building on a dev server, a testing server and a production server and you may not want to be sedning emails with the same details. Just give each block a different name and refer to them in wherever you use the email module.


## Example kitchen sink quilk.json

An example quilk.json file is now available at the following link, https://johnc1984.github.io/quilk/


## Example browserifyMain.js file which requires other modules
```
"use strict";
module.exports = {
	formValidator	: require('./formValidator'),
	validators		: require( './validators')
};
```
The modules using the above kitchen sink json would be accessed in you application like this (the `browserify_bundle_name` you use is what you call in your application):
```
var passfail = bfyModules.validators.parse( 'is_max_length:50', 'some input string' );
```

## Which notifier to use
The desktop notifier is defined developer by developer. Most teams today do not insist that all devs work on the same OS, and most devs have their own preferences to their own machine.

With quilk you can turn on or off the notifications on a dev by dev basis, just set on to true or false.

There are also a few alternative desktop popups available and vary from OS to OS. As Windows potentially has two types (depending on the version XP, 7 or 10) this block in the json is granular down to the type of popup. And below is the list:

1.  **WindowsBalloon**: Typically for windows 7,8,10.

1.  **WindowsToaster**: Typically for windows 7,8 (10 seems to default to the balloon).

1.  **Growl**: Typically for mac users.

1.  **NotifySend**: Typically for Linux.

The notifier uses this module: https://www.npmjs.com/package/node-notifier#all-notification-options-with-their-defaults

The notifier object for the current quilk developer will, along with the title and message, be passed to the notifier. Please refer to their documentation for the options, if you see an option from their docs, just add it to your quilk.json as another key/value pair in the `notifier` object of your developer.
