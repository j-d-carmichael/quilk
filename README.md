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

-- browserify_bundle: This will build a bundle.js from other js modules. A must for when building nodeJs web applications, use select server side code at the client and the client code at the server, less code to write. 

-- js_find: This will create a single js file based on js files it finds within an array of paths you provide. You may also state which files must be included at the top of the generated file.

-- js_fixed: A simplified version of js_find, provide a static list of files and the module will simply concat them all together in a single js file.

-- less_std: (work in progress) A standard module to build css files. Provide the entry point and output point and the module will handle the rest.

-- sass_std: A standard module to build css from sass files. The same as the less_std, provide the in and out and the module handles the rest. It being sass of course results in a much much faster time to compile.

-- sass_find: (work in progress) Slightly different from the sass_find, this module will find sass files in paths you provide and create a single sass file, ever so slightly slower than the sass_std, but which ever floats your boat :)

2.  Custom modules: Coming soon. Should you require a module that is not part of the std pack, simply build your own, with what ever tech you need. The idea with quilk is not to provide a one stop shop for every single possible thing that every single developer would ever need, but just to provide a simple module runner that is flexible and fast. As a developer I have spent many moons waiting for npm install to download the earth and more, and that is just for the dev tools. 

3. Each module requires its own set config data, and this data is set in the `quilk.json` file. See the example below

### Example quilk.json file
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

