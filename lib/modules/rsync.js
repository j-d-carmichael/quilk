var cliarg = require('jdc-node-cliarg-reader')
var clc = require('cli-color')
var command_run = require('../command_run')
var path = require('path')

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
        if (rsyncObj.ignore && Array.isArray(rsyncObj.ignore)) {
          for (i = 0; i < rsyncObj.ignore.length; ++i) {
            addToArgs('--exclude=' + rsyncObj.ignore[i])
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
  }
}
