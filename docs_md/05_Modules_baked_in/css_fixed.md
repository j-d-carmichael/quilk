**css_fixed**

A simple concat module, supply it paths from the root of your project and output will be one big css file. Perfect for including css from 3rd parties eg via bower.

**An example quilk.json block**
```
    {
      "name" : "Vendor CSS Files",
      "module": "css_fixed",
      "files": [
        "/public/bower_components/bootstrap/dist/css/bootstrap.css",
        "/public/bower_components/ngDialog/css/ngDialog.css",
        "/public/bower_components/ngDialog/css/ngDialog-theme-plain.css"
      ],
      "target": "/public/css/vendor.css"
    },
```    