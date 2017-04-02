![](https://img.shields.io/npm/v/quilk.svg) ![](https://img.shields.io/npm/dt/quilk.svg)

[![NPM](https://nodei.co/npm/quilk.png?downloads=true&downloadRank=true)](https://nodei.co/npm/quilk/)


#quilk
Est. 4th Sept. 2016

---

Quilk is a developer tool to build your project from a standardised JSON file, or a common js module. Both without requiring a long list of dependencies, just a single install of quilk.

In brief, quilk is a lightweight abstracted module runner that will:

* Compile **SASS** with node-sass, either by **finding scss** files or by giving it simple entry point.
* Compile **LESS** (no find module was written for LESS files).
* Generate a single CSS file from a **fixed list of CSS** files.
* **Concat** big client side js from a fixed list or instruct quilk to **find** js files in a folder.
* **Babelify** your code (requires you to install locally your preferred preset).
* **Rsync** files locally to a development server, ideal for ensuring each dev has the same environment, and saves so much time!
* **Obfusicate, minify** javascript or css using the **node-minify** module check out their docs for more on node-minify.
* **Strip out** comments from js code.
* Configure **independent** blocks for developers.
* **Desktop notifications** on or off or on for varying levels.
* Ping messages via **email** when a built has finished, with success or not.
* Ping messages via **webhooks** when a build was successful or a giant failure. 
* **Watch** a local fileset with the watch flag (**chokidar** under the hood), just tell quilk to not watch the built files with the don't watch directive.

Most of the standard jobs can be covered with a single quilk file and the baked in modules into quilk, however there is of course the ability to write your own modules for quilk, either publicy hosted of privately nested in your project repo.

---

### Documentation here 
[https://jdcrecur.github.io/quilk/](https://jdcrecur.github.io/quilk/)

---

*If anyone fancies helping [evolve](https://github.com/jdcrecur/quilk/) quilk give me a shout, many [skilled] hands make light work.*


### Latest commits

babili from node minify works (To get this working (for now) you must install node-minify to your project & the preset you need.):
1.  Example use of babili. In this case the babel config is coming from a .babelrc file.
```
{
    name: "minify the app js",
    module: "node_minify",
    type:"babili",
    options: {
        babelrc: '.babelrc'
    },
    input:  "/src/browser_app/js/app.js",
    target: "/public/build/js/app.js"
}
```

The babelify module has had some attention. In fact there are now 3 modules:
1.  babelify_vendor, babelify_app and babelify. As you might have guessed the vendor version is for vendor files, the app for app and the plain old babelify to include it all in one file. Here are a few examples:
```
{
    name: 'Vendor Files babelify',
    module: 'babelify_vendor',
    working_directory: '/src/browser_app', /* <<< this is optional. If not present then it works from the same as directory as the quilk js */
    npm_modules: [
        "bootstrap-sass",
        "d3",
        "jquery",
        "lodash",
        "promise-polyfill",
        "renderjson"
    ],
    npm_modules: "package.json", /* <<< either instruct the module to read the package.json or give it a list of modules. */
    configure: {
        babelrc: '.babelrc'
    },
    target: '/public/build/js/vendor.js'
}
```

```
{
    name: 'Vendor Files babelify',
    module: 'babelify_app',
    working_directory: '/src/browser_app', /* <<< this is optional. If not present then it works from the same as directory as the quilk js */
    entries: "/js/app.js",
    npm_modules: "package.json", /* <<< either instruct the module to read the package.json or give it a list of modules like above */
    configure: {
        babelrc: '.babelrc'
    },
    target: '/public/build/js/app.js'
}
```