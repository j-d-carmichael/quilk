var cliarg      = require('jdc-node-cliarg-reader'),
    clc         = require('cli-color'),
    command_run = require('../command_run')

module.exports = {
  run: function (next) {

    var args
    if (global.current_module.useSetOnly !== true) {
      args = ['-avz', '--delete', '--chmod=u=rwx,g=rwx,o=r']
    } else {
      args = []
    }

    /**
     * Ensure duplicates are not added
     * @param arg
     */
    function addToArgs (arg) {
      if (args.indexOf(arg) === -1) {
        args.push(arg)
      }
    }

    if (!require('../onlyModuleCheck')('rsync')) return next()

    if (global.cliArgs.release) {
      global.log.general('Running a release thus rsync not required, skipping this module.')
      return next()
    }

    var rsyncObj = global.quilkConf.developers[global.cliArgs.developer].rsync

    //don't run this rsync module if the developer conf is set to not do so.
    if (typeof global.quilkConf.developers[global.cliArgs.developer].rsync === 'undefined') {
      global.log.general(global.cliArgs.developer + ' not configured to run the rsync, skipping this module.')
      return next()
    }

    // For windows
    if (global.quilkConf.developers[global.cliArgs.developer].platform === 'windows' && !global.current_module.useSetOnly) {
      //for windows
      addToArgs('--chmod=ug=rwx,o=rx')
    }

    // If no "sync_all" flag sent, add the excludes (moving to camelcase, keeping the old _ for compatibility
    if (!global.cliArgs.syncAll) {
      //add the global excludes
      var i
      if (global.current_module.ignore) {
        if (global.current_module.ignore.global) {
          for (i = 0; i < global.current_module.ignore.global.length; ++i) {
            addToArgs('--exclude=' + global.current_module.ignore.global[i])
          }
        }
        if (global.current_module.ignore[global.quilkConf.developers[global.cliArgs.developer].platform]) {
          for (i = 0; i < global.current_module.ignore[global.quilkConf.developers[global.cliArgs.developer].platform].length; ++i) {
            addToArgs('--exclude=' + global.current_module.ignore[global.quilkConf.developers[global.cliArgs.developer].platform][i])
          }
        }
      }
    }

    if (global.cliArgs.sync_all) {
      global.log.error(clc.bold('sync_all is deprecated and will be removed in the future. Please now use syncAll.'))
    }

    //add the global sets
    if (global.current_module.set) {
      if (typeof global.current_module === 'string') {
        global.current_module = [global.current_module]
      }
      for (i = 0; i < global.current_module.set.length; ++i) {
        addToArgs(global.current_module.set[i])
      }
    }

    //add the developer specific sets
    if (rsyncObj.set) {
      if (typeof rsyncObj.set === 'string') {
        rsyncObj.set = [rsyncObj.set]
      }
      for (i = 0; i < rsyncObj.set.length; ++i) {
        addToArgs(rsyncObj.set[i])
      }
    }

    //if dry run is in the cli args, this will print out what would be run.. but its a dry run so nothing actually runs
    if (global.cliArgs.dryRun) {
      addToArgs('--dry-run')
    }

    //add the non-specific port
    if (rsyncObj.port) {
      addToArgs('-e "ssh -p' + rsyncObj.port + '"')
    }

    //are we pulling
    if (global.cliArgs.rsyncPull) {
      if (rsyncObj.remote && rsyncObj.remote !== '') {
        addToArgs(rsyncObj.remote + ':' + rsyncObj.serverPath)
      } else {
        addToArgs(rsyncObj.serverPath)
      }

      //add the source and target then run
      addToArgs(rsyncObj.localPath)
    }
    //or sending
    else {
      //add the source and target then run
      addToArgs(rsyncObj.localPath)
      if (rsyncObj.remote && rsyncObj.remote !== '') {
        addToArgs(rsyncObj.remote + ':' + rsyncObj.serverPath)
      } else {
        addToArgs(rsyncObj.serverPath)
      }
    }

    global.log.general(clc.bold('The rsync args are about to run are:'))
    global.log.general(args)

    //run the rsync command
    command_run('rsync', args, next)
  },

  help: function () {
    var helps = [
      'A module used to sync your local fileset to somewhere else.',
      'You must ensure both the target and source have rsync installed (rsync is typically installed by default on most unix systems)',
      'In the config you set the global ignores in the rsync module ref in the quilk.json modules array',
      'The rest of the config is generally placed in the developer specific object. Each dev will more the likely have their own local and remote paths',
      '',
      'Why ignore.. it is better to ignore node_modules as different OS\'s have different compiled versions of different packages.',
      'Also, it is better to ignore composer files to for the same reason but also (important for non ssd) to improve speed. Tell rsync to sync 20,000 files and it will but on a std hdd this is slower than on an ssd...',
      'There is also a sync_all option you can pass from the cli, this will sync your entire fileset, after which you can then safely ignore the dependency folders.',
      '',
      'Please see the readme for an example quilk json. This is a direct use of nodejs and not using a 3rd party rsync library'
    ]
    var clc   = require('cli-color')
    global.log.general(clc.bold.underline('rsync module help - start'))
    for (var key in helps) {
      global.log.general(helps[key])
    }
    global.log.general(clc.bold.underline('rsync module help - end'))
  }
}