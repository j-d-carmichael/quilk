**babelify**

This module is, like many of quilk's other modules, an abstraction. It is to the popular babelify npm. 

quilk comes with the following presets:
```
"babel-preset-es2015"           : "6.18.0",
"babel-preset-es2016"           : "6.16.0",
"babel-preset-es2017"           : "6.16.0",
"babel-preset-react"            : "6.16.0"
```

And the following pluggin
```
"babel-root-import"             : "4.1.5",
```

If you need any of the other many presets and plugins available, just include them in your local package.json file and quilk will pick them up automatically for you.

**An example quilk.json with configure data**

Note in this example the "configure" block. If you are familiar with babelify you will recognise this is passing the config data in directly into the configure method: https://github.com/babel/babelify#options

```
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
    }
```


**An example quilk.json using .babelrc file**
Note in this example the "configure" block is missing. Instead the data is moved to a .babelrc file: http://babeljs.io/docs/usage/babelrc/#top

```
    {
      "name": "Just for fun",
      "module": "babelify",
      "debug": false,
      "entries": "./src/js/index.js",
      "target": "/build/app.js"
    }
```

Example .babelrc file
```
{
   "presets": [ "es2015" ],
   "plugins": [
       ["babel-root-import", {
           "rootPathPrefix": "~",
           "rootPathSuffix": "./src/js"
       }]
   ]
}
```