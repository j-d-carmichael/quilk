### JSON or module.exports

It is up to you but here is a quick pros and cons list.

#### JSON Pro
1.  A JSON file cannot contain unknown code thus prevents less experienced developers from getting lost when they inevitably try to reinvent the wheel.

#### JSON Con
1.  A JSON file can be restrictive if you want to build something aside from the norm.
1.  A JSON file cannot contain comments, but then the json format is always the same thus comments are not really needed... but if comments are one of your preffered ingredients...

#### module.exports Pro
1.  There are no restrictions, comments, additional modules.. they can all be used to generate the quilk config.

#### module.exports Con
1.  You will loose the benifit of the a standardised quilk.json file.
1.  A developer will start adding their creative powers to the mundane build process of the project instead of the project itself.


### Example JSON and module
JSON:
```
{
  "modules" : [
    {
      "name": "Just for fun",
      "module": "just_for_fun",
      "print_this": "This should be run by the the quilk runner"
    }
  ],
  "developers" : {
    "default" : {
      "platform" : "windows",
      "notifier" : {
        "on"   : false,
        "style": "WindowsBalloon",
        "time" : 5000,
        "sound": true
      }
    }
  }
}
```

Module export
```
module.exports = {
  modules: [
    // Module exports can hold comments as it is plain old javascript ;)
    {
      name: "Just for fun",
      module: "just_for_fun",
      print_this: "This should be run by the the quilk runner"
    }
  ],
  developers : {
    default : {
      platform : "windows",
      notifier : {
        on  : false,
        style: "WindowsBalloon",
        time : 5000,
        sound: true
      }
    }
  }
}
```