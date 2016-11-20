**js_find**

This will create a single js file based on js files it finds within an array of paths you provide. You may also state which files must be included at the top of the generated file.

**An example quilk.json block**
```
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
```