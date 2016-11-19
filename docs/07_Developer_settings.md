**Developers block** 

This can be as general or as granular as your like. As you can see from the example, this also contains developer specifics for the rsync module and notification popups (not everyone wants to see the notification balloon).

**Example**
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
      "platform" : "windows",
      "notifier" : {
        "on"   : true,
        "style": "WindowsBalloon",
        "time" : 5000,
        "sound": true
      },
      "rsync" : {
        "localPath"     : "/mnt/project101/",
        "remote"        : "john@8.8.8.8",
        "serverPath"    : "/var/node/www.101.com/"
      }
    }
  }
```