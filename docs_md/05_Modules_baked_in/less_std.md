**less_std**

A standard module to build css files. Provide the entry point and output point and the module will handle the rest.

**An example quilk.json block**
```
    {
      "name"   : "Less compiler",
      "module" : "less_std",
      "resourcePaths" : ["/resources/assets/less/"],
      "input_path"  : "/resources/assets/less/xenon.less",
      "target" : "/public/css/app.css"
    },
```