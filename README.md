![](https://img.shields.io/npm/v/quilk.svg) ![](https://img.shields.io/npm/dt/quilk.svg)

#quilk
Est. 4th Sept. 2016

---

Quilk is a developer tool to build your project from a standardised JSON file.

In brief, quilk is a lightweight abstracted module runner that will compile SASS, find SASS files automatically, LESS, babelify, browserify files. Concat big client side application js & find. Generate CSS from a fixed list. Obfusicate, minify javascript or sqwish css. Ping messages via email or webhooks when a build was successful or a giant failure. Offset your developers working environments to a standardized server for the ultimate team collaboration setup. Use quilk to compile client side code for multiple environments.

To ensure things remain constant between your companies projects, the build file is a standard JSON file. There is of course the ability to write your own modules for quilk, either publicy hosted of privately nested in your project repo.

*A lot more under the hood, check the documentation page for more.*

---

### Full quilk documentation here 
[https://jdcrecur.github.io/quilk/](https://jdcrecur.github.io/quilk/)

---

*If anyone fancies helping [evolve](https://github.com/jdcrecur/quilk/) quilk give me a shout, many [skilled] hands make light work.*


### Last commit
You can now use a json file or js module returning a js object representation of the json file. Using a js module opposed to a json opens to doors to nice comments... but also dynamically generating the output.
Here are the docs for json or module: [https://jdcrecur.github.io/quilk/json-or-module.html](https://jdcrecur.github.io/quilk/json-or-module.html)


The notifier is now either on, off, or on for up to varying levels, configurable from the json, eg:
```
"notifier" : {
    "on_for_level": 10,
    "style": "NotifySend",
    "time" : 2500
},
```
EG: To be told only when quilk build has finished and errors, choose level 9.
Here are the docs for notifications: [https://jdcrecur.github.io/quilk/Desktop_notifications.html](https://jdcrecur.github.io/quilk/Desktop_notifications.html)