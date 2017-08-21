var fs = require('fs-extra'),
    _  = require('lodash')

module.exports = {
  run: function (next) {

    if (!require('../onlyModuleCheck')('copy')) return next()

    if( typeof global.current_module.source === 'string' ){
      global.current_module.source = [global.current_module.source]
    }

    // check for a hit
    if (global.chokidarFileChangePath) {
      var skip = false
      _.map(global.current_module.source, function( source ){
        if (global.chokidarFileChangePath.indexOf(source) === -1) {
          skip = true
          global.log.general('Not copy list so skipping this module.')
        }
      });
      if( skip ){
        return next()
      }
    }

    if (global.cliArgs.release && global.current_module.dontRunOnRelease) {
      global.log.general('This copy module is configured to not run on a release.')
      return next()
    }

    global.log.general('Clearing out the target.')
    fs.emptyDir(global.pwd + global.current_module.target, function (err) {
        if (err) {
          global.desktopNotify('quilk error', 'please see the terminal', 10)
          global.log.error('ERROR')
          global.log.error('Could not empty directory before copying!')
          global.log.error(err)
          next()
        } else {
          global.log.general('Copying in the source.')
          setTimeout(function () {

            function popper (sources) {
              if (sources.length === 0) {
                return next()
              } else {
                var source = sources.shift()
                fs.copy(global.pwd + source, global.pwd + global.current_module.target, function (err) {
                  if (err) {
                    global.desktopNotify('quilk error', 'please see the terminal', 10)
                    global.log.error('ERROR')
                    global.log.error('Could not copy!')
                    global.log.error(err)
                    return next()
                  } else {
                    logTime('Copied the source to the target: ' + global.pwd + source + ' >>> ' + global.pwd + global.current_module.target)
                    popper(sources)
                  }
                })
              }
            }

            if( typeof global.current_module.source === 'string' ){
              popper([global.current_module.source])
            } else {
              popper(global.current_module.source)
            }
          }, 10)
        }
      }
    )
  },

  help: function () {
    var helps = [
      'A simple module to copy a folder and the contents to a new destination. Pass in an array of destinations or just one string.'
    ]
    var clc   = require('cli-color')
    console.log(clc.bold.underline('copy module help - start'))
    for (var key in helps) {
      console.log(helps[key])
    }
    console.log(clc.bold.underline('copy module help - end'))
  }
}