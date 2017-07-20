**rsync**

Not everyone is a fan of overheating your local machine and burning it into the ground before it is due just so they can claim they can work on the bus. If this is you and you want ot ensure a dev env that is identical for everyone rsync is for you. Rsync only syncs the files that have changed since the last time it ran, opposed to all files every time. If you are using windows you would want to look at cygwin tools or cwrsync. This rsync module just uses nodejs 'require('child_process').spawn'. If you see something in rsync you want to use, just add it to the `set` array, see the kitchen sink for an example. NB the set array can either be global or developer specific

**An example quilk.json block**
This contains the global configuration applied to all developers using rsync.
```
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
```

Note: You may override the default options passed: "`--avz --delete`" with only those added to your own `set` directive by adding `useSetOnly: true`

**Developer block configuration**
The module runner will not run the module unless the developer contains an rsync configuration part. Below we can see 3 developer blocks configured, the first is the default configuration, the 2nd & 3rd are specific for particular developers. John is configured to run an rsync based on the rsync block, where as Jan is not. In Jan's case the rsync module will simply not run (the rest of modules will run of course). A typical use case is Jan wishes to run a vagrant box for example.

Any additional options, just place in the set array as seen below. You can also just set up this in your local ssh config file.
```
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
    },
    "jan" : {
      "platform"      : "windows",
      "notifier"      : {
        "on"   : true,
        "style": "WindowsBalloon",
        "time" : 2500,
        "sound": true
      }
    }
  },
```