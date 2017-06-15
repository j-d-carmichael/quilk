**node_minify**

This is a direct mapping to the popular node_minify npm packge. Typically you would use this module in the release block of your quilk.json as there is not much point in continually compressing code for development as this will slow development down.


**Babelify your code**
You can use the node_minify module to run Babelify your code. All you need to do is install locally the preset(s) and plugins.

Here is an example quilk config:
```
{
    name: "Babelify it",
    module: "node_minify",
    type:"babili",
    options: {
        babelrc: '.babelrc'
    },
    input:  "/public/build/js/app.js",
    target: "/src/browser_app/js/app.js"
}

```

And here is an example .babelrc file:
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


**Example use of node_minify in a release block**

Below we can that post build of the usual modules we compress the javascript and then the css. In this case we are not using a .min naming convention and simply taking the .css file already compiled and simply overwriting them with a newly compressed file.
```
 "release_commands_or_modules": {
    "live":{
      "post": [{
        "name": "minify the js",
        "module": "node_minify",
        "type":"uglifyjs",
        "input":[ "/build/js/app.js" ],
        "target": "/build/js/app.js"
      },{
        "name": "minify the css",
        "module": "node_minify",
        "type":"sqwish",
        "input":[ "/build/css/app.css" ],
        "target": "/build/css/app.css"
      }],
```