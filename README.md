![](https://img.shields.io/npm/v/quilk.svg) ![](https://img.shields.io/npm/dt/quilk.svg)

[![NPM](https://nodei.co/npm/quilk.png?downloads=true&downloadRank=true)](https://nodei.co/npm/quilk/)


#quilk
Est. 4th Sept. 2016

---

In brief, quilk is a lightweight standardised module runner. Pre-baked modules in quilk can do the following:

* **Rsync** files locally to a development server, ideal for ensuring each dev has the same environment and doesn't need to spend time managing a virtual box or its CPU overheads.
* Compile [**SASS**](https://www.npmjs.com/package/node-sass) with node-sass, either by **finding scss** files or by giving it simple entry point.
* Compile [**LESS**](https://www.npmjs.com/package/less) (no find module has been written for LESS files yet).
* Generate a single CSS file from a **fixed list of CSS** files.
* Compile JS code with [**Babelify**](https://www.npmjs.com/package/babelify) either in one big file or broken into vendor.js and app.js with the babelify_app and babelify_vendor module.
* [**Browserify**](https://www.npmjs.com/package/browserify) your backend modules to share with the front end.
* [**Concat**](https://www.npmjs.com/package/concat) big client side js from a fixed list or instruct quilk to **find** js files in a folder with concat or node-minify
* **Obfusicate, minify** javascript or css using the [**node-minify**](https://www.npmjs.com/package/node-minify) module check out their docs for more on node-minify.
* **Strip out** comments from js code.
* Configure **independent** blocks for developers.
* [**Desktop notifications**](https://www.npmjs.com/package/node-notifier) on or off or on for varying levels.
* Ping messages via [**email**](https://www.npmjs.com/package/nodemailer) when a built has finished, with success or not.
* Ping messages via **webhooks** via the [request](https://www.npmjs.com/package/request) npm when a build was successful or a giant failure, eg into a slack channel.
* **Watch** a local fileset with the watch flag ([**chokidar**](https://www.npmjs.com/package/chokidar). Control how the watcher behaves by passing in the chokidar_options from the quilk file globally or even developer by developer.

Most of the standard jobs can be covered with a single quilk file and the baked in modules into quilk, however there is of course the ability to write your own modules for quilk, either publicy hosted of privately nested in your project repo.

---

## Documentation here 
[https://jdcrecur.github.io/quilk/](https://jdcrecur.github.io/quilk/)

---

*If anyone fancies helping [evolve](https://github.com/jdcrecur/quilk/) quilk give me a shout, many [skilled] hands make light work.*

## Running a quilk file
`quilk` 

or 

`quilk watch` 

or 

`quilk watch d=john` 

or to just run a select group of modules from a quilk file 

`quilk watch d=john module=sass_std module=rsync`

### Example quilk file
```
module.exports = {
  // The modules this quilk file should run
  modules: [
    {
      name: '(custom project specific module) Preapre the js config files based on the .env file',
      module: 'prepareJSConfigFiles'
    },
    {
      name: 'App file',
      module: 'babelify',
      configure: {
        babelrc: '.babelrc'
      },
      extensions: ['.js'],
      debug: true,
      entries: 'resources/assets/js/app.js',
      target: '/public/js/app.js'
    },
    {
      name: 'App CSS',
      module: 'sass_std',
      outputStyle: 'expanded',
      sourceComments: true,
      input_path: 'resources/assets/sass/app.scss',
      target: '/public/css/app.css'
    }
    {
      name: 'Rsync it',
      module: 'rsync',
      ignore: {
        windows: [],
        mac: [],
        linux: [],
        global: [
          '.git/*',
          '.idea/*',
          'storage/app/*',
          'storage/logs/*',
          'node_modules'
        ]
      }
    }
  ],

  // The projects custom quilk modules location
  custom_module_path: 'quilk_modules',

  // Watcher don't run the modules when files change here...
  dont_watch: [
    '.git/',
    'node_modules',
    'vendor',
    'public/css',
    'public/fonts',
    'public/js'
  ],

  // The watcher options. See https://www.npmjs.com/package/chokidar for all the settings available
  chokidar_options: {
    awaitWriteFinish: false
  },
  
  // Stop the watcher being triggered multiple times by other watchers, this grace time defaults to 500.
  watcher_wait_between_changes: 500,

  // Additional modules to run for live or staging, eg node_minify for js and css
  release_commands_or_modules: {
    prod: {
      post: [{
        name: 'minify the vendor js',
        module: 'node_minify',
        type: 'uglifyjs',
        input: ['/public/js/app.js'],
        target: '/public/js/app.js'
      }, {
        name: 'minify the css',
        module: 'node_minify',
        type: 'sqwish',
        input: ['/public/css/app.css'],
        target: '/public/css/app.css'
      }]
    }
  },
  
  // The developers own custom settings
  developers: {
    default: {
      platform: 'windows',
      notifier: {
        on: false,
        style: 'WindowsBalloon',
        time: 5000,
        sound: true
      }
    },
    john: {
      platform: 'windows',
      notifier: {
        on: false
      },
      chokidar_options: {
        awaitWriteFinish: true,
        atomic: 50
      },
      rsync: {
        localPath: '/cygdrive/c/code//project-x/',
        remote: 'www-data@myserver',
        serverPath: '/var/www/vhosts/project-x/'
      }
    }
  }
}
```


### Tips

1. All use of babelify or the babili compressor within the node-minify module require you to install your presets locally.
1. Most in-built modules will pass in the options from the quilk file directly to the npm package they are an abstraction for, so for full options please check the individual npm packages.
1. Take control of the chokidar watcher options for all developers, or developer by developer... each to their own.
1. Got more than 1 watcher on the go, check out the `watcher_wait_between_changes` flag if you're getting collisions.

### Latest commit
1. Dependency updates and attempting to flush npm readme cache again due to recent bugs with NPM. 