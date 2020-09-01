![](https://img.shields.io/npm/v/quilk.svg) ![](https://img.shields.io/npm/dt/quilk.svg)

[![NPM](https://nodei.co/npm/quilk.png?downloads=true&downloadRank=true)](https://nodei.co/npm/quilk/)

## Documentation here 
[https://jdcrecur.github.io/quilk/](https://jdcrecur.github.io/quilk/)

---

## Setup

1 - Install, `npm install quilk --save-dev` then add to your package.json file's script block:
```
  ...
  "scripts": {
    ...
    "quilk": "quilk -- d=yourdevelopername"
    ...
  },
  ...
```

2 - Add your quilk.js(on) file, either vua `npm run quilk init` or build your own (see the example below).

3 - Run your quilk build file with any of the following options `npm run quilk` runs the default user from the quilk file, or specify the user `npm run quilk developer=john` and lastly add a watch flag to re-run the modules after files change

### What is does
In brief (see the example quilk file before), quilk is a lightweight standardised module runner. Pre-baked modules in quilk can do the following:

Watch a file base and trigger modules on file changes via chokidar, modules include:
- babelify
- babelify_app
- babelify_vendor
- browserify_bundle
- command_run
- copy
- css_fixed
- email
- js_find
- js_fixed
- js_strip
- just_for_fun
- node_minify
- rsync
- sass_find
- sass_std
- webhook
---

### Kitchen'esk sink exmaple config file:
`quilk.js`:
```javascript
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
    },
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

1. The leading slash for everything is not relevant, add or not, quilk will only ever work within the current directory of the quilk file or a child directory. This is for security to prevent careless mistakes and potential loss of work.
1. The rsync module... be sure to add the trailing slash else you will end up with a directory in a directory. And ALWAYS double check your paths!
1. Most in-built modules will pass in the options from the quilk file directly to the npm package they are an abstraction for, so for full options please check the individual npm packages, eg chokidar
1. Got more than 1 watcher on the go, check out the `watcher_wait_between_changes` flag if you're getting collisions.
1. Don't forget to add your own `.babelrc` file when using any of `babel` modules as mentioned above
1. The `watch` flag will rebuild even when it sees a new built file, to prevent this you can tell the watch to not watch specific paths (this is added a regex pattern internally to chokidar)