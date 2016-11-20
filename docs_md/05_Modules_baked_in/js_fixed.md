**js_fixed**

A simplified version of js_find, provide a static list of files and the module will simply concat them all together in a single js file.

**An example quilk.json block**
```
    {
      "name" : "Vendor Files",
      "module": "js_fixed",
      "files": [
        "/public/bower_components/jquery/dist/jquery.js",
        "/public/bower_components/bootstrap/dist/js/bootstrap.min.js",
        "/public/bower_components/angular/angular.min.js",
        "/public/bower_components/angular-route/angular-route.min.js",
        "/public/bower_components/angular-sanitize/angular-sanitize.min.js",
        "/public/bower_components/angular-bootstrap/ui-bootstrap.min.js",
        "/public/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
        "/public/bower_components/ngDialog/js/ngDialog.min.js"
      ],
      "target": "/public/js/vendor.js"
    },
```