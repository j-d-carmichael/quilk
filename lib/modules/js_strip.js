var strip = require('strip-comments')
var path = require('path')
var fs = require('fs')

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

    fs.readFile(path.join(global.pwd, global.current_module.source), 'utf8', function (err, data) {
      if (err) {
        return console.log(err)
      }
      fs.writeFile(path.join(global.pwd, global.current_module.target), strip(data), function (err) {
        if (err) {
          return console.log(err)
        }
        logTime('Js file stripped: ' + global.pwd + global.current_module.target)
        next()
      })
    })
  }
}