var fs   = require('fs')
var path = require('path')

module.exports = {
  run: function (next) {
    if (!require('../onlyModuleCheck')('css_fixed')) return next()
    if (global.chokidarFileChangePath) {
      //vendor scripts are exact, check for an exact match
      if (global.current_module.files.indexOf(global.chokidarFileChangePath) === -1) {
        global.log.general('Not in the static list of CSS files so skipping this module.')
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
        global.log.error('One or more js files not found, aborting this CSS fixed module run.')
        global.log.error(file_name)
        global.desktopNotify('quilk error', 'please see the terminal', 10)
        return next()
      }
    }

    //last but not least, concat them all together
    require('concat-files')(files, path.join(global.pwd, global.current_module.target), function () {
      logTime('Built fixed list css file')
      next()
    })
  }
}
