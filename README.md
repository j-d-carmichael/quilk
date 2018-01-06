![](https://img.shields.io/npm/v/quilk.svg) ![](https://img.shields.io/npm/dt/quilk.svg)

[![NPM](https://nodei.co/npm/quilk.png?downloads=true&downloadRank=true)](https://nodei.co/npm/quilk/)

#quilk
Est. 4th Sept. 2016

---

## Installing
```
npm install quilk --save-dev
```

NB: There are issues installing node-sass, thus quilk, globally on *nix systems related to permissions with npm v5+.

## Documentation here 
[https://jdcrecur.github.io/quilk/](https://jdcrecur.github.io/quilk/)

---

## Setting up with your project

1 - Add to your projects package.json file a new script:
```
  ...
  "scripts": {
    ...
    "quilk": "node node_modules/quilk/bin/quilk.js"
    ...
  },
  ...
```

2 - Add your quilk.js(on) file

Either run `npm run quilk init` or build your own (see the example below).

3 - Run your quilk build file with any of the following options
```
npm run quilk
npm run quilk developer=john
npm run quilk d=john
npm run quilk d=john watch
```

4 - You can also limit which modules from your quilk file are run:

```
npm run quilk d=john watch module=sass_std module=rsync
```

### What is does
In brief (see the example quilk file before), quilk is a lightweight standardised module runner. Pre-baked modules in quilk can do the following:

* **Rsync** files locally to a development server, ideal for ensuring each dev has the same environment and doesn't need to spend time managing a virtual box or its CPU overheads.
* Compile JS code with [**Babelify**](https://www.npmjs.com/package/babelify) either in one big file or broken into vendor.js and app.js with the babelify_app and babelify_vendor module.
* [**Browserify**](https://www.npmjs.com/package/browserify) your backend modules to share with the front end.
* [**Concat**](https://www.npmjs.com/package/concat) big client side js from a fixed list or instruct quilk to **find** js files in a folder with concat or node-minify
* **Obfusicate, minify** javascript or css using the [**node-minify**](https://www.npmjs.com/package/node-minify) module check out their docs for more on node-minify.
* **Strip out** comments from js code.
* Compile [**SASS**](https://www.npmjs.com/package/node-sass) with node-sass, either by **finding scss** files or by giving it simple entry point.
* Compile [**LESS**](https://www.npmjs.com/package/less) (no find module has been written for LESS files yet).
* Generate a single CSS file from a **fixed list of CSS** files.
* Configure **independent** blocks for developers.
* [**Desktop notifications**](https://www.npmjs.com/package/node-notifier) on or off or on for varying levels.
* Ping messages via [**email**](https://www.npmjs.com/package/nodemailer) when a built has finished, with success or not.
* Ping messages via **webhooks** via the [request](https://www.npmjs.com/package/request) npm when a build was successful or a giant failure, eg into a slack channel.
* **Watch** a local fileset with the watch flag ([**chokidar**](https://www.npmjs.com/package/chokidar). Control how the watcher behaves by passing in the chokidar_options from the quilk file globally or even developer by developer.

Most of the standard jobs can be covered with a single quilk file and the baked in modules into quilk, however there is of course the ability to write your own modules for quilk, either publicy hosted of privately nested in your project repo.

---

### Babelify your javascript apps

You can easily use quilk to build es* javascript apps, under the hood it all maps to babelify. Following the latest recommendations of babelify it is now advised to use babel-preset-env npm package as your preset.

As there are many many presets available, there are no presets built into the quilk core modules just as babelify do not bundle any into their core. Here is an all-round quick start that will get you moving with quilk:

1 - `npm install babel-preset-env --save-dev`

2 - Add a `.babelrc` file to the root of your project with the following:
```
{
  "presets": ["babel-preset-env"]
}
```

3 - Add the following quilk module to your quilk.js(on) file:
```
  modules: [
    {
      name       : 'JS babel app',
      module     : 'babelify',
      configure  : {
        babelrc: '.babelrc'
      },
      extensions : ['.js'],
      debug      : true,
      entries    : '/src/app.js',
      target     : '/build/js/app.js'
    }
  ],
```

That's it. The above module will use the babel preset and .babelrc file to correctly output a browser readable js file at `/build/js/app.js`. The output above will include all the js required, this might not be ideal in bigger apps, see the babelify app and vendor modules to break up the code base.

NB: For the keen eyes amongst you, babel-preset-env page advises using https://github.com/babel/babel/tree/master/packages/babel-preset-env however please note that the latest release of babelify 8 does only include Babel 6 which does not support this new preset.

### Example quilk.js file (a quilk.json file is also valid)
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
      set: [ /* Additional rsync options to be passed */
        '--copy-links',
        '--quiet'
      ],
      ignore: {
        windows: [
          /* Working on windows for a unix production env makes little sense, as such often certain files should not be synced */
          'vendor'
        ],
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

1. The leading slash for everything is not relavent, add or not, quilk will only ever work within the current directory of the quilk file or a child directory. This is for security to prevent careless mistakes and potential loss of work.
1. The rsync module... be sure to add the trailing slash else you will end up with a directory in a directory. And ALWAYS double check your paths!
1. Most in-built modules will pass in the options from the quilk file directly to the npm package they are an abstraction for, so for full options please check the individual npm packages, eg chokidar
1. Got more than 1 watcher on the go, check out the `watcher_wait_between_changes` flag if you're getting collisions.
1. Don't forget to add your own `.babelrc` file when using any of `babel` modules as mentioned above
1. The `watch` flag will rebuild even when it sees a new built file, to prevent this you can tell the watch to not watch specific paths (this is added a regex pattern internally to chokidar)


### Latest change(s)

1. Removed the module help commands in favour of the online docs.
2. Updated the dependencies
3. Leading slashes, use them or not. All paths will now always be relative to the directory of the quilk file called.