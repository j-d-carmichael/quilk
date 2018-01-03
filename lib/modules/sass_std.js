var fs       = require('fs')
var nodeSass = require('node-sass')
var path     = require('path')

module.exports = {
  run: function (next) {

    if (!require('../onlyModuleCheck')('sass_std')) return next()

    if (global.chokidarFileChangePath) {
      if (global.chokidarFileChangePath.indexOf('.scss') === -1) {
        global.log.general('Not a sass file, skipping this module')
        return next()
      }
    }

    var scssPath   = path.join(global.pwd, global.current_module.input_path)
    var outputPath = path.join(global.pwd, global.current_module.target)

    nodeSass.render({
      file          : scssPath,
      outFile       : outputPath,
      outputStyle   : global.current_module.outputStyle,
      sourceComments: global.current_module.sourceComments
    }, function (err, result) {

      //this is the complete function that runs after the css file has been written to the buffer
      if (err) {
        global.log.error('ERROR:')
        global.log.error(err)
        return next()
      }

      fs.writeFile(outputPath, result.css.toString(), function (err) {
        global.log.general('Built css file to: ' + outputPath)

        if (typeof global.current_module.include_css === 'object') {
          if (global.current_module.include_css.length > 0) {
            var i
            for (i = 0; i < global.current_module.include_css.length; ++i) {
              global.current_module.include_css[i] = path.join(global.pwd, global.current_module.include_css[i])
            }

            global.log.general('Adding additional CSS files to the compiled SASS generated CSS file: ')
            global.log.general(global.current_module.include_css)

            var addOnCSS = [outputPath].concat(global.current_module.include_css)

            //check all the js files actually exist
            for (i = 0; i < addOnCSS.length; ++i) {
              try {
                fs.statSync(addOnCSS[i])
              }
              catch (err) {
                //err = no files, log error and abort
                logTime('ERROR: CSS file not found in the sass_std module.')
                global.desktopNotify('quilk error', 'please see the terminal', 10)
                global.log.error(err)
                return next()
              }
            }

            //now we have built the all.css, append the bower component specific stuff, eg ng-dialog
            require('concat-files')(addOnCSS, outputPath, function () {
              global.log.general('CSS files concatenated with the generate css file.')
              return next()
            })
          }
          else {
            return next()
          }
        }
        else {
          return next()
        }
      })
    })
  }
}
