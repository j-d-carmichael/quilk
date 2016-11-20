**sass_find** 

Slightly different from the sass_find, this module will find sass files in paths you provide and create a single sass file, ever so slightly slower than the sass_std, but which ever floats your boat :). 

As with the sass_std module, any additional settings you see in node-sass you would like to use, just add them and they will be passed on. EG below you can see `"outputStyle": "expanded",` & `"sourceComments": true,`.

**An example quilk.json block**
```
    {
      "name": "App CSS (SASS find)",
      "module": "sass_find",
      "outputStyle": "expanded",
      "sourceComments": true,
      "include_first": [
        "/public/app/core/scss/global.scss"
      ],
      "ignorePaths" : [
        "core/scss"
      ],
      "find_in_path": "/public/app/",
      "target": "/public/css/index.css"
    },
```    
    