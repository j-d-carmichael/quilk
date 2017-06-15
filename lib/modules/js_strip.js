var strip = require('strip-comments'),
  fs = require('fs'),
  log = require('../log')

module.exports = {
  run: function (next) {

    if (!require('../onlyModuleCheck')('js_strip')) return next()

    if (global.chokidarFileChangePath) {
      //vendor scripts are exact, check for an exact match
      if (global.current_module.source.indexOf(global.chokidarFileChangePath) === -1) {
        global.log.general('Not a file to strip.. skipping the strip module module')
        return next()
      }
    }

    fs.readFile(global.pwd + global.current_module.source, 'utf8', function (err, data) {
      if (err) {
        return console.log(err)
      }
      fs.writeFile(global.pwd + global.current_module.target, strip(data), function (err) {
        if (err) {
          return console.log(err)
        }
        logTime('Js file stripped: ' + global.pwd + global.current_module.target)
        next()
      })
    })
  },

  help: function () {
    var helps = [
      'A simple module to create a flat single file for a list of other js files.',
      'Please see the readme for an example quilk json.'
    ]
    var clc = require('cli-color')
    console.log(clc.bold.underline('js_fixed module help - start'))
    for (var key in helps) {
      console.log(helps[key])
    }
    console.log(clc.bold.underline('js_fixed module help - end'))
  }
}