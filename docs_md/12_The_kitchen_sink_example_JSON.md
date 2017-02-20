Below is an example quilk.json file that uses everything that quilk can offer.

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
      "name": "Just for fun",
      "module": "babelify",
      "configure": {
           "presets": [ "es2015" ],
           "plugins": [
               ["babel-root-import", {
                   "rootPathPrefix": "~",
                   "rootPathSuffix": "./src/js"
               }]
           ]
       }
      "debug": false,
      "entries": "./src/js/index.js",
      "target": "/build/app.js"
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
      "set"           : ["--quiet"],
      "ignore": {
        "linux" :   [],
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

  "release_commands_or_modules": {
    "live":{
      "pre": [
        "echo 'install the dependencies from npm and bower..'",
        {
          "name": "running bower install",
          "module": "command_run",
          "program": "bower",
          "arguments": ["install", "-s"]
        },
      ],
      "post": [{
        "name": "minify the js",
        "module": "node_minify",
        "type":"uglifyjs",
        "input":[ "/build/js/app.js", "/public/js/bundle.js" ],
        "target": "/build/js/app.min.js"
      },{
        "name": "minify the css",
        "module": "node_minify",
        "type":"sqwish",
        "input":[ "/build/css/app_less.css", "/build/css/app_sass.css", "/build/css/vendors.css" ],
        "target": "/build/css/app.min.css"
      }],
      "complete" : [{
        "name": "Email total output",
        "module": "email",
        "config": "main",
        "email_subject": "Logs from quilk build on live",
        "email_message": "The quilk build for live has just finished.",
        "include_log": true
      }],
      "error" : [{
        "name" : "Pinging slack",
        "module" : "webhook",
        "include_logs": true,
        "message_start" : "Error building, here are the quilk logs",
        "url" : "https://hooks.slack.com/services/11111111/000000000/000000000003"
      }]
    }
  },

  "developers" : {
    "default" : {
      "platform" : "windows",
      "notifier" : {
        "on"   : false,
        "style": "WindowsBalloon",
        "time" : 5000,
        "sound": true
      }
    },
    "john" : {
      "platform"      : "windows",
      "notifier"      : {
        "on"   : true,
        "style": "WindowsBalloon",
        "time" : 2500,
        "sound": true
      },
      "rsync"         : {
        "set"           : ["--compress-level=1"],
        "localPath"     : "/cygdrive/d/test_project/",
        "remote"        : "www-data@8.9.10.110",
        "serverPath"    : "/var/vhosts/service-test/"
      }
    }
  },

  "email": {
    "dev": {
      "email_to" : ["john@mail.com", "quilk@mrsquilks.com"],
      "email_from" : {
        "name": "quilk",
        "email": "me@quilk.com"
      },
      "transport_options": {
        "host": "smtp.gmail.com",
        "port": 465,
        "secure": true,
        "auth": {
          "user": "john@gmail.com",
          "pass": "password"
        }
      }
    },
    "live": {
      "email_to" : ["john@mail.com", "quilk@mrsquilks.com"],
      "email_from" : {
        "name": "quilk",
        "email": "me@quilk.com"
      },
      "transport_options": {
        "environment_variables": true,
        "host": "EMAIL_HOST",
        "port": "EMAIL_PORT",
        "secure": "EMAIL_SECURE",
        "auth": {
          "user": "EMAIL_USER",
          "pass": "EMAIL_PASS"
        }
      }
    }
  }
}
```