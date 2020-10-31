process.bin = process.title = 'quilk'

/**
 * Load in the nodejs modules required for quick sync to run
 */
var path = require('path')
var _ = require('lodash')
var reloadQuilkJson = require('./reloadQuilkJson')
var clc = require('cli-color')
var pwd = global.pwd = process.cwd()
var log = global.log = require('./log')
var mk_t = require('./make_targets')

/**
 * The following is to place into the global namespace logTime
 * This is useful for logging to the terminal from within any of the quilk modules
 */
var time = global.time = function time () {
  return (new Date()).getTime() / 1000
}
var start = global.start = time()
var logTime = global.logTime = function (message, style1, style2) {
  style1 = style1 || false
  style2 = style2 || false
  var messageT
  if (style1 && !style2) {
    message = clc[style1]('---- ' + message)
    messageT = clc[style1]('---- ' + 'Time ' + runningTime() + 's')
  } else if (style1 && style2) {
    message = clc[style1][style2]('---- ' + message)
    messageT = clc[style1][style2]('---- ' + 'Time ' + runningTime() + 's')
  } else {
    messageT = '---- ' + 'Time ' + runningTime() + 's'
  }
  log.general(' ')
  log.general(message)
  log.general(messageT)
}
var runningTime = function () {
  return _.round(Number(time()) - Number(start), 3)
}

/**
 * Read all the command line arguments into quilk
 */
var cliArgs = require('./commander')
global.cliArgs = cliArgs

/**
 * Setup the notifier based on the quilk.json settings
 */
var desktopNotify = global.desktopNotify = require('./notify')

/**
 * Abstracted die function mapping to process.exit();
 */
var die = global.die = require('./die')

/**
 * Sorting out the d/developer shortcuts and fallback to default
 */
if (!cliArgs.developer) {
  cliArgs.developer = global.cliArgs.developer = 'default'
}

/**
 * Holder for the path change, used by the watcher
 * @type {boolean}
 */
global.chokidarFileChangePath = false

/**
 * Init or not
 */
if (cliArgs.init) return require('./init')()

/**
 * Load the quilk.json config file
 */
var quilkConf = global.quilkConf = reloadQuilkJson()

/**
 * Check we have a developer object in the quilk.json
 */
if (typeof quilkConf.developers === 'undefined') return log.error('ERROR: Please pass a valid developer to quilk or ensure a default developer is created')

/**
 * Check we have a valid developer
 */
if (!quilkConf.developers[cliArgs.developer] && !cliArgs.release) {
  log.error('ERROR: You have not passed a valid developer. Please enter a valid developer from the quilk.json file')
  log.general('(If you did not pass a developer in the cli arguments then you must create a developer titled default. Please see the lib/resource/quilk.json on quilk github or run `quilk init`)')
  process.exit()
}

/**
 * The release flag was passed, check we have a valid release option to run
 */
if (cliArgs.release) {
  if (!quilkConf.release_commands_or_modules[cliArgs.release]) return log.error('ERROR: You have entered release with no valid option')
}

/**
 * Now set up the release object for the usual quilk modules to run without error
 */
if (!quilkConf.developers[cliArgs.developer] && cliArgs.release) {
  cliArgs.developer = global.cliArgs.developer = 'release'
  quilkConf.developers['release'] = global.quilkConf.developers['release'] = {
    notifier: {
      on: false
    },
    rsync: false
  }
}

/**
 * The ignore function is run on each file found from the readdir function.
 * If the return is false then the file is not passed to the final array in the cb.
 * Only js files are passed in this case.
 * @param file
 * @param stats
 * @returns {boolean}
 */
function ignoreFunc (file, stats) {
  return (path.basename(file).indexOf('.js') === -1)
}

/**
 * The build function called by the watcher
 */
var building = false
var waiting = false
var haltBuild = false
var build = global.build = function (modules_received, cb, no_final_stats) {
  mk_t(_.cloneDeep(modules_received), function () {

    // The clock will already be in progress if this is a release
    if (!cliArgs.release) {
      start = time()
    }

    if (!cliArgs.quiet) {
      desktopNotify('Running quilk', ' ', 5)
    }

    log.general('')
    log.success('START')

    //walk through the files running one at a time
    function runquilks (modules) {
      building = true
      if (modules.length > 0) {
        if (!haltBuild) {
          //try load the quilk module from the one of the default sets
          global.current_module = modules.shift()

          if (!require('./onlyModuleCheck')(global.current_module.module)) {
            return runquilks(modules)
          }

          var file = './modules/' + global.current_module.module,
            module
          try {
            module = require(file)
          } catch (e1) {
            //try and load the quilk module from the custom modules
            var custom_module_path = quilkConf.custom_module_path || '/quilk_modules/'
            file = pwd + custom_module_path + global.current_module.module
            try {
              module = require(file)
            } catch (e2) {
              //ok, so the quilk modules and custom project modules were not found, now try a project npm package
              try {
                var packageJson = require(global.pwd + '/node_modules/' + global.current_module.module + '/package.json')
                if (packageJson.main) {
                  module = require(global.pwd + '/node_modules/' + global.current_module.module + '/' + packageJson.main)
                }
              } catch (e3) {
                log.error('ERROR: Could not find module "' + global.current_module.module + '"')
                log.general(e1)
                log.general(e2)
                log.general(e3)
                log.general('')
                log.general('')
                logTime('Aborting quilk. Could not find the module in the default quilk list or your own custom list. Please review the errors above.')
                die()
              }
            }
          }

          logTime('Running ' + file, 'bold')
          if (global.current_module.name) log.loud('---- Quilk module named: ' + global.current_module.name)

          try {
            module.run(function () {
              runquilks(modules)
            })
          } catch (e) {
            log.error('There was an error in the module: ' + file)
            log.general(e)
            logTime('Aborting quilk. An error was found in the above module.')
            die()
          }
        } else {
          log.general(' ')
          log.error('Halting the quilk and starting again as another file change has been heard by old Mr Chokidar')
          log.general(' ')
          log.general(' ')
          building = false
          haltBuild = false
        }
      } else {
        building = false
        haltBuild = false
        if (!no_final_stats) {
          logTime('Total time to run Mrs Quilks (& your) modules: ' + runningTime() + 'seconds', 'bold')
          if (!cliArgs.quiet) {
            desktopNotify('quilk finished', 'Total time: ' + runningTime() + 'seconds', 9)
          }
        }

        log.success('END')
        log.general('')

        if (cb) {
          cb()
        }
      }
    }

    //anndd go.
    runquilks(_.cloneDeep(modules_received))
  })
}

/**
 * Function to ignore special file endings generated by ide's
 * @param path
 * @returns {boolean}
 */
var file_endings_ignore_array = ['___jb_tmp___', '.idea', '.git']
if (quilkConf['dont_watch']) {
  file_endings_ignore_array = file_endings_ignore_array.concat(quilkConf['dont_watch'])
}

/**
 * The watcher function
 */
var watcher = function () {
  if (cliArgs.watch) {

    var choki_opts = _.merge({
      persistent: true,
      followSymlinks: false,
      alwaysStat: true,
      awaitWriteFinish: false
    }, quilkConf.chokidar_options || {})

    if (global.quilkConf.developers[global.cliArgs.developer].chokidar_options) {
      choki_opts = _.merge(choki_opts, global.quilkConf.developers[global.cliArgs.developer].chokidar_options)
    }

    choki_opts.ignored = new RegExp(String(file_endings_ignore_array.join('|')).replace(/([\/.])/g, '\\$1'))

    log.general(' ')
    log.general(' ')
    logTime('Watcher setup with the following options (to alter these please configure with the "chokidar_options" options directive in you quilk file:', 'bold')
    log.general(choki_opts)

    var runOnEvents = [
      'add',
      'change',
      'unlink'
    ]

    if (quilkConf.run_on_events) {
      runOnEvents = runOnEvents.concat(quilkConf.run_on_events)
    }

    var Spinner = require('cli-spinner').Spinner

    log.general(' ')
    log.general(' ')
    logTime('Adding project files to be watched', 'bold')

    var spinner = new Spinner('Please wait... %s')
    spinner.setSpinnerString(7)
    spinner.start()

    var allAdded = false

    if (!cliArgs.quiet) {
      desktopNotify('Adding the files to watch', 'This may take up to 10 seconds. Wait for the console to stop flickering.', 5)
    }

    if (!Date.now) {
      Date.now = function () { return new Date().getTime() }
    }

    var watchTime = Date.now()

    // One-liner for current directory, ignores .dotfiles
    require('chokidar').watch(global.pwd, choki_opts)
      .on('ready', function () {
        allAdded = true
        spinner.stop()
        log.success(' Great, your project is now being watched... :)')
        log.general('Time ' + runningTime() + 's')
        log.general(' ')
        log.general(' ')
        if (!cliArgs.quiet) {
          desktopNotify(' Great!', 'Your project is now being watched... :)', 5)
        }
      })
      .on('all', function (event, path) {

        //don't run if these file changes happened within 500ms of each other as this is likely due to another file watche
        if (runOnEvents.indexOf(event) !== -1 && allAdded) {

          var changeOn = path.replace(/\\/g, '/')
          var run = true
          for (var i = 0; i < file_endings_ignore_array.length; ++i) {
            if (changeOn.indexOf(file_endings_ignore_array[i]) !== -1) {
              run = false
            }
          }

          if (run) {

            //check the timer
            if (Number((Date.now() - watchTime)) < Number((quilkConf.watcher_wait_between_changes || 500))) return

            //reset the watch timer
            watchTime = Date.now()

            if (waiting) {
              log.general('Already waiting for a previous queue to finish.')
            } else {
              log.general('Event "' + event + '" heard on path: ' + changeOn)
              if (building) {
                waiting = true
                log.general('quilk already in progress, waiting.')
                haltBuild = true
                //now wait for the previous builds to finish before starting a new one.
                var interaval = setInterval(function () {
                  if (!building) {
                    clearInterval(interaval)
                    waiting = false
                    global.chokidarFileChangePath = changeOn
                    reloadQuilkJson(function (quilkConf) {
                      build(quilkConf.modules)
                    })
                  }
                }, 500)
              } else {
                global.chokidarFileChangePath = changeOn.replace(pwd, '')
                reloadQuilkJson(function (quilkConf) {
                  build(quilkConf.modules)
                })
              }
            }
          }
        }
      })
  }
}

//if releasing, run the release command before running the quilk modules
if (cliArgs.release) {
  var releaseCommandRunner = require('./release_runner')

  function release_completed (releaseObj) {
    if (releaseObj.complete) {
      releaseCommandRunner(releaseObj.complete, 'completed', function () {
        global.log.success('END RELEASE')
      })
    }
  }

  start = time()
  if (quilkConf.release_commands_or_modules[cliArgs.release].pre) {
    //trigger the release commands
    releaseCommandRunner(quilkConf.release_commands_or_modules[cliArgs.release].pre, 'pre', function () {
      global.log.general('Normal quilk modules array starting.')
      build(quilkConf.modules, function () {
        global.log.general('Normal quilk modules array finished.')
        if (quilkConf.release_commands_or_modules[cliArgs.release].post) {
          releaseCommandRunner(quilkConf.release_commands_or_modules[cliArgs.release].post, 'post', function () {
            log.success('The release ' + cliArgs.release + ' has now completed.')
            release_completed(quilkConf.release_commands_or_modules[cliArgs.release])
          })
        } else {
          log.success('The release ' + cliArgs.release + ' has now completed.')
          release_completed(quilkConf.release_commands_or_modules[cliArgs.release])
        }
      }, true)
    })
  } else {
    global.log.general('Normal quilk modules array starting.')
    build(quilkConf.modules, function () {
      global.log.general('Normal quilk modules array finished.')
      if (quilkConf.release_commands_or_modules[cliArgs.release].post) {
        releaseCommandRunner(quilkConf.release_commands_or_modules[cliArgs.release].post, 'post', function () {
          log.success('The release ' + cliArgs.release + ' has now completed.')
          release_completed(quilkConf.release_commands_or_modules[cliArgs.release])
        })
      } else {
        log.success('The release ' + cliArgs.release + ' has now completed.')
        release_completed(quilkConf.release_commands_or_modules[cliArgs.release])
      }
    }, true)
  }
}
//not release, just run the build and pass in the watcher as the callback (this will only watch is the watch cli command has been passed.
else {
  build(quilkConf.modules, function () {
    watcher()
  })
}
