**babelify_app**

This module works hand in hand with babelify_vendor. It will compile your app js but will not bundle all the required modules into the same file.

**Example**
```
{
    name: 'Vendor Files babelify',
    module: 'babelify_app',
    npm_modules: "package.json",
    configure: {
        babelrc: '.babelrc'
    },
    extensions: ['.js'],
    debug: true,
    entries: "/js/app.js",
    target: '/public/build/js/app.js'
}
```
Very simple to run, just pass either an array of modules to exclude, or use the package.json. Give it an entry point and you're good to go.

**Don't forget** to also install locally any presets you declare within your .babelrc file.

**Tips** 
* Set debug to false in your release block.
* The default configure is just bablify with no preset.
* The default extensions is `["js"]`.
