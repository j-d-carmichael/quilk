**node_minify**

This is a direct mapping to the popular node_minify npm packge. Typically you would use this module in the release block of your quilk.json as there is not much point in continually compressing code for development as this will slow development down.

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