**babelify_vendor**

This is used for when you need to split your vendor javascript into one file and the actual app js into another. This keeps those file sizes down.

The end result of this module will be a single JS file that has exposed all the required modules. These modules can then be used in your app.js that could be built with babelify_app.

There are 3 main ways you can use this module:

**1) Building the vendor.js from the package.json**
```
{
    name: 'Vendor Files babelify',
    module: 'babelify_vendor',
    npm_modules: "package.json",
    configure: {
        babelrc: '.babelrc'
    },
    target: '/public/build/js/vendor.js'
}
```
By default anything you add to the 'bundleExclude' directive of the package.json will not be included.


**2) Building the vendor.js from a set list of modules**
```
{
    name: 'Vendor Files babelify',
    module: 'babelify_vendor',
    npm_modules: [
        "d3",
        "jquery",
        "promise-polyfill",
    ],
    configure: {
        babelrc: '.babelrc'
    },
    target: '/public/build/js/vendor.js'
}
```
This will quite simply grab all the modules you explicitly declare in the numeric array and bundle them into the target.


**2) Specify a directory to expect the node_modules folder to be**
```
{
    name: 'App JS Files babelify',
    working_directory: '/src/browser_app',
    module: 'babelify_app',
    entries: "/js/app.js",
    npm_modules: "package.json",
    configure: {
        babelrc: '.babelrc'
    },
    target: '/public/build/js/app.js'
}
```

In the above example, quilk will load the modules from `/src/browser_app` within the project.
