var fs   = require('fs-extra')
var path = require('path')
var _    = require('lodash')

module.exports = {
  run: function (next) {

    if (!require('../onlyModuleCheck')('copy')) return next()

    if (typeof global.current_module.source === 'string') {
      global.current_module.source = [global.current_module.source]
    }

    // check for a hit
    if (global.chokidarFileChangePath) {
      var skip = false
      _.map(global.current_module.source, function (source) {
        if (global.chokidarFileChangePath.indexOf(source) === -1) {
          skip = true
          global.log.general('Not copy list so skipping this module.')
        }
      })
      if (skip) {
        return next()
      }
    }

    if (global.cliArgs.release && global.current_module.dontRunOnRelease) {
      global.log.general('This copy module is configured to not run on a release.')
      return next()
    }

    global.log.general('Clearing out the target.')
    if (global.current_module.target.length <= 4) {
      global.desktopNotify('quilk error', 'please see the terminal', 10)
      global.log.error('ERROR')
      global.log.error('It looks like something is wrong with the copy module. You have specified a target of less that 4 characters... to prevent you accidentally losing all the data in your project this safety trigger was thrown and the process aborted.')
      global.log.error()
      process.exit()
    }
    fs.emptyDir(path.join(global.pwd, global.current_module.target), function (err) {
        if (err) {
          global.desktopNotify('quilk error', 'please see the terminal', 10)
          global.log.error('ERROR')
          global.log.error('Could not empty directory before copying!')
          global.log.error(err)
          next()
        }
        else {
          global.log.general('Copying in the source.')
          setTimeout(function () {

            function popper (sources) {
              if (sources.length === 0) {
                return next()
              }
              else {
                var source = sources.shift()
                var fqs = path.join(global.pwd, source)
                var fqt = path.join(global.pwd, global.current_module.target)
                fs.copy(fqs, fqt, function (err) {
                  if (err) {
                    global.desktopNotify('quilk error', 'please see the terminal', 10)
                    global.log.error('ERROR')
                    global.log.error('Could not copy!')
                    global.log.error(err)
                    return next()
                  }
                  else {
                    logTime('Copied the source to the target: ' + fqs + ' >>> ' + fqt)
                    popper(sources)
                  }
                })
              }
            }

            if (typeof global.current_module.source === 'string') {
              popper([global.current_module.source])
            }
            else {
              popper(global.current_module.source)
            }
          }, 10)
        }
      }
    )
  }
}