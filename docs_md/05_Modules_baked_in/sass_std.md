**sass_std**

A standard module to build css from sass files. The same as the less_std, provide the in and out and the module handles the rest. It being sass of course results in a much much faster time to compile.

As with the sass_find module, any additional settings you see in node-sass you would like to use, just add them and they will be passed on. EG below you can see `"outputStyle": "expanded",` & `"sourceComments": true,`.

**An example quilk.json block**
```
    {
      "name": "App CSS",
      "module": "sass_std",
      "outputStyle": "expanded",
      "sourceComments": true,
      "input_path": "/resources/assets/sass/app.scss",
      "target": "/public/css/all.css"
    },
```