**browserify_bundle**

This will build a bundle.js from other js modules. A must for when building nodeJs web applications, use select server side code at the client and the client code at the server, less code to write.

**An example quilk.json block**
```
    {
      "name": "Browserify files",
      "module" : "browserify_bundle",
      "browserify_main": "/public/browserify_modules/browserifyMain.js",
      "browserify_bundle_name": "bfyModules",
      "target" : "/public/js/bundle.js"
    },
```


**Example browserify main**
```
"use strict";
module.exports = {
	formValidator	: require('./formValidator'),
	validators		: require( './validators')
};
```
The modules using the above kitchen sink json would be accessed in you application like this (the `browserify_bundle_name` you use is what you call in your application):
```
var passfail = bfyModules.validators.parse( 'is_max_length:50', 'some input string' );
```
