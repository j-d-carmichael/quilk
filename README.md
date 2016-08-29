# note
This is still a work in progress.

# quilk
quilk. A builder and watcher with speed. No complex build configuration file required, just a simple config.

quilk modules are light and fast, they work rapid fast on a std HDD and blink of an eye fast on an SSD.

## Example single run
`quilk d=john`

## Example run then watch
`quilk d=john watch`

## Example run for live
`quilk release=live`

## How it works
1.  quilk comes installed with 7 modules ready to go:
    1. **browserify_bundle**: This will build a bundle.js from other js modules. A must for when building nodeJs web applications, use select server side code at the client and the client code at the server, less code to write.
    2. **js_find**: This will create a single js file based on js files it finds within an array of paths you provide. You may also state which files must be included at the top of the generated file.
    3. **js_fixed**: A simplified version of js_find, provide a static list of files and the module will simply concat them all together in a single js file.
    4. **less_std**: A standard module to build css files. Provide the entry point and output point and the module will handle the rest.
    5. **sass_std**: A standard module to build css from sass files. The same as the less_std, provide the in and out and the module handles the rest. It being sass of course results in a much much faster time to compile.
    6. **sass_find**: Slightly different from the sass_find, this module will find sass files in paths you provide and create a single sass file, ever so slightly slower than the sass_std, but which ever floats your boat :)
    7. **css_fixed**: A simple concat module, supply it paths from the root of your project and output will be one big css file. Perfect for including css from 3rd parties eg via bower.
    8. **rsync**: Not everyone is a fan of overheating your local machine and burning it into the ground before it is due just so they can claim they can work on the bus. If this is you and you want ot ensure a dev env that is identical for everyone rsync is for you. Rsync only syncs the files that have changed since the last time it ran, opposed to all files every time. For a mid-weight project the build+sync time on a typical internet connection would be around 3-5 seconds, which, is far superioir that the 5-10second load time of a vagrant machine, and far superior to have developers working on say nginx when the prod is apache etc etc. Now throw into the mix a remote or semi remote team, with the rsync module you can now see everyones dev env. without actually having to get you eyes on their machine... bonus for everyone, the devs, the designers, the product owners and of course, the all important fillet steak holder. For windows users, a dependency for this to work is cygwin or cwrsync. Plenty of guides out there for installation, just ensure that rsync is available in your PATH var and ssh can connect to your dev machine via ssh keys without a pass-phrase. (http://www.beingyesterday.com/bitbucket-sourcetree-ide-rsync-dev-server/   Step 3, cygwin is my preferred method :]).

2.  Custom modules: Coming soon. Should you require a module that is not part of the std pack, simply build your own, with what ever tech you need. The idea with quilk is not to provide a one stop shop for every single possible thing that every single developer would ever need, but just to provide a simple module runner that is flexible and fast. As a developer I have spent many moons waiting for npm install to download the earth and more, and that is just for the dev tools. 

3. Each module requires its own set config data, and this data is set in the `quilk.json` file. See the example below

## Example kitchen sink quilk.json file. Note this exmaple uses every out of the box module
```
{
  "modules" : [
    {
      "name": "Browserify files",
      "module" : "browserify_bundle",
      "browserify_main": "/public/browserify_modules/browserifyMain.js",
      "browserify_bundle_name": "bfyModules",
      "target" : "/public/js/bundle.js"
    },
    {
      "name" : "Vendor Files",
      "module": "js_fixed",
      "files": [
        "/public/bower_components/jquery/dist/jquery.js",
        "/public/bower_components/bootstrap/dist/js/bootstrap.min.js",
        "/public/bower_components/angular/angular.min.js",
        "/public/bower_components/angular-route/angular-route.min.js",
        "/public/bower_components/angular-sanitize/angular-sanitize.min.js",
        "/public/bower_components/angular-bootstrap/ui-bootstrap.min.js",
        "/public/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
        "/public/bower_components/ngDialog/js/ngDialog.min.js"
      ],
      "target": "/public/js/vendor.js"
    },
    {
      "name": "App Files",
      "module": "js_find",
      "include_first": [
        "/public/js_to_compile/globalOverrideFunctions.js",
        "/public/js_to_compile/app.js",
        "/public/js_to_compile/app.config.js"
      ],
      "find_in_paths": [
        "/public/js_to_compile/"
      ],
      "target" : "/public/js/build.js"
    },
    {
      "name": "App CSS",
      "module": "sass_std",
      "outputStyle": "expanded",
      "sourceComments": true,
      "input_path": "/resources/assets/sass/app.scss",
      "target": "/public/css/all.css"
    },
    {
      "name": "App CSS (SASS find)",
      "module": "sass_find",
      "outputStyle": "expanded",
      "sourceComments": true,
      "include_first": [
        "/public/app/core/scss/global.scss"
      ],
      "ignorePaths" : [
        "core/scss"
      ],
      "find_in_path": "/public/app/",
      "target": "/public/css/index.css"
    },
    {
      "name"   : "Less compiler",
      "module" : "less_std",
      "resourcePaths" : ["/resources/assets/less/"],
      "input_path"  : "/resources/assets/less/xenon.less",
      "target" : "/public/css/app.css"
    },
    {
      "name" : "Vendor CSS Files",
      "module": "css_fixed",
      "files": [
        "/public/bower_components/bootstrap/dist/css/bootstrap.css",
        "/public/bower_components/ngDialog/css/ngDialog.css",
        "/public/bower_components/ngDialog/css/ngDialog-theme-plain.css"
      ],
      "target": "/public/css/vendor.css"
    },
    {
      "name": "Rsync it",
      "module": "rsync",
      "ignore": {
        "windows" : [],
        "mac"     : [],
        "global"  : [
          ".git*",
          ".idea*",
          "storage",
          "node_modules/*",
          "tests/*",
          "vendor/*"
        ]
      }
    }
  ],

  "dont_watch": [
    "public/js/",
    "public/css/all.css"
  ],

  "release_commands": {
    "live": [],
    "dev":[]
  },

  "developers" : {
    "john" : {
      "platform"      : "windows",
      "notifier"      : {
        "on"   : true,
        "style": "WindowsBalloon",
        "time" : 2500,
        "sound": true
      },
      "rsync"         : {
        "localPath"     : "/cygdrive/d/test_project/",
        "remote"        : "www-data@8.9.10.110",
        "serverPath"    : "/var/vhosts/service-test/"
      }
    }
  }
}
```
`dont_watch`
Note the `dont_watch` this is telling the watcher (chokidar) to not build when it spots a changes in these paths. IE after a quilk module has built a file, chokidar wont trigger the module to run again... ie avoiding that infinite loop.

`developers`
This can be as general or as granular as your like. As you can see from the example, this also contains developer specifics for the rsync module.


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