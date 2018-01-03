var fs   = require('fs')
var path = require('path')

module.exports = {
  run: function (next) {

    if (!require('../onlyModuleCheck')('js_fixed')) return next()

    if (global.chokidarFileChangePath) {
      //vendor scripts are exact, check for an exact match
      if (global.current_module.files.indexOf(global.chokidarFileChangePath) === -1) {
        global.log.general('Not a file in the fixed list, skipping this module')
        return next()
      }
    }

    var files = []
    for (var i = 0; i < global.current_module.files.length; ++i) {
      var file_name = path.join(global.pwd, global.current_module.files[i])
      try {
        fs.statSync(file_name)
        files.push(file_name)
        files.push(__dirname + '/../resource/spacer.txt')
      }
      catch (err) {
        //err = no files, log error and abort
        global.desktopNotify('quilk error', 'please see the terminal', 10)
        global.log.error('ERROR')
        global.log.error('One or more js files not found, aborting quilk.')
        global.log.error(file_name)
        return next()
      }
    }

    global.log.general('All files found and validated.')

    //last but not least, concat them all together
    require('concat-files')(files, path.join(global.pwd, global.current_module.target), function () {
      logTime('Built concatenated js file: ' + global.pwd + global.current_module.target)
      //6 - run the main callback of the module
      next()
    })
  }
}