module.exports = {

  // The modules this quilk file should run
  modules : [
    {
      name: "Just for fun",
      module: "just_for_fun",
      print_this: "This should be run by the the quilk runner, start here for the default modules available:  https://jdcrecur.github.io/quilk/Modules_baked_in/babelify.html"
    }
  ],

  // The projects custom quilk modules location
  custom_module_path: 'quilk_modules',

  // Watcher don't run the modules when files change here...
  dont_watch: [
    // Don't forget to set! Any paths in here the watcher will not watch,
    // Typically build folder paths are added here else the watcher will build
    // in an infinite loop.
    '/path/the/watcher/should/not/watch'
  ],

  // Additional modules to run for live or staging, eg node_minify for js and css
  release_commands_or_modules: {
    live:{
      pre: [
        "echo 'PRE-LIVE-RELEASE command...'"
      ],
      post: [{
        name: "Just for fun",
        module: "just_for_fun",
        print_this: "This is the post std build command, note this is a quilk module"
      }]
    }
  },

  // The watcher options. See https://www.npmjs.com/package/chokidar for all the settings available
  chokidar_options: {
    atomic: 100
  },

  // The developers custom settings
  developers : {
    default : {
      platform : "windows",
      notifier : {
        on   : false,
        style: "WindowsBalloon",
        time : 5000,
        sound: true
      }
    }
  }
}