var less = require('less')
var fs = require('fs')
var path = require('path')

module.exports = {
  run: function (next) {

    if (!require('../onlyModuleCheck')('less_std')) return next()

    if (global.chokidarFileChangePath) {

      global.log.general(global.chokidarFileChangePath)

      if (global.chokidarFileChangePath.indexOf('.less') === -1) {
        global.log.general('Not a less file so skipping this module')
        return next()
      }
    }

    var lessPath = path.join(global.pwd, global.current_module.input_path)
    var outputPath = path.join(global.pwd, global.current_module.target)

    //inject the folder base dir to the resource paths
    if (global.current_module.resourcePaths) {
      for (var key in global.current_module.resourcePaths) {
        global.current_module.resourcePaths[key] = path.join(global.pwd, global.current_module.resourcePaths[key])
      }
    }

    global.logTime('Building css file from: ' + lessPath)
    fs.readFile(lessPath, function (error, data) {
      data = data.toString()
      global.logTime('Base less file read, passing to less render')
      less.render(data, {
        paths: global.current_module.resourcePaths
      }, function (e, css) {
        if (e) {
          global.logTime(e)
          return next()
        }
        global.logTime('CSS compiled, starting write to disk')
        fs.writeFile(outputPath, css.css, function (err) {
          if (err) {
            global.log.general(err)
            global.desktopNotify('quilk error', 'please see the terminal', 10)
          }
          global.logTime('File written to disk: ' + outputPath)
          //now we have built the all.css, append the bower component specific stuff, eg ng-dialog
          return next()
        })
      })
    })
  }
}
