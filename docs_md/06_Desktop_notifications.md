The desktop notifier is defined developer by developer. Most teams today do not insist that all devs work on the same OS, and most devs have their own preferences to their own machine.

With quilk you can turn on or off the notifications on a dev by dev basis, just set on to true or false.

There are also a few alternative desktop popups available and vary from OS to OS. As Windows potentially has two types (depending on the version XP, 7 or 10) this block in the json is granular down to the type of popup. And below is the list:

1.  **WindowsBalloon**: Typically for windows 7,8,10.

1.  **WindowsToaster**: Typically for windows 7,8 (10 seems to default to the balloon).

1.  **Growl**: Typically for mac users.

1.  **NotifySend**: Typically for Linux.

The notifier uses this module: [node-notifier](https://www.npmjs.com/package/node-notifier#all-notification-options-with-their-defaults)

The notifier object for the current quilk developer will, along with the title and message, be passed to the notifier. Please refer to their documentation for the options, if you see an option from their docs, just add it to your quilk.json as another key/value pair in the `notifier` object of your developer.

#### Example
```
  "developers" : {
    "default" : {
      "platform" : "windows",
      "notifier" : {
        "on"   : true,
        "style": "WindowsBalloon",
        "time" : 5000,
        "sound": true
      }
    }
  },
```

#### Notification levels
You can set levels in your json, it can be a bit much in some builds to be told of literally everything via a desktop notification while conversally being a little too little with none.

To use levels the json might look like:
```
  "developers" : {
    "john" : {
      "platform" : "linux",
      "notifier" : {
        "on_for_level": 10,
        "style": "NotifySend",
        "time" : 2500
      },
```      

The levels are currently:
- 10 - Only errors
- 9 - Build finished + above
- 8 
- 7 
- 6 
- 5 - Watching and read + above
- 4
- 3
- 2
- 1
- 0








