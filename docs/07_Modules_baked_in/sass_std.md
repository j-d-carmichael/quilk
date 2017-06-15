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

**Adding bower css files to the generated output**

Occasionally you find a 3rd party dependency from say bower that doesn't contain a SASS file to add into your sassy mix. No problem, quilk can accommodate this easily by adding a numeric array of paths relative to your quilk.json:
```
{ "name": "App CSS",
      "module": "sass_std",
      "outputStyle": "expanded",
      "sourceComments": true,
      "include_css": [
        "/public/app/bower_components/ng-dialog/css/ngDialog.min.css",
        "/public/app/bower_components/ng-dialog/css/ngDialog-theme-default.min.css",
        "/public/app/bower_components/select2/dist/css/select2.min.css",
        "/public/app/bower_components/datatables.net-dt/css/jquery.dataTables.min.css"
      ],
      "input_path": "/public/app/sass/all.scss",
      "target": "/public/css/all.css" }
```

The output will be the compiled CSS from the SASS then in the same outputted file the additional CSS injected via the include_css section.