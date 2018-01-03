var fse  = require('fs.extra')
var log  = require('./log')
var path = require('path')

/**
 * Inject the quilk modules array and here we will auto create all the target directories if they do already exist
 * @param modules
 * @param cb
 */
module.exports = function (modules, cb) {
  var module_t

  function recursive_mkt () {
    if (modules.length > 0) {
      module_t = modules.pop()
      if (module_t.target) {
        var outputPath = path.join(global.pwd, module_t.target)
        outputPath     = outputPath.split('/')
        outputPath.pop()
        outputPath = outputPath.join('/')
        //first ensure we have the less folder, and make if not
        fse.mkdirp(outputPath, function (err) {
          if (err) {
            log.error('ERROR COULD NOT MAKE THE BASE JS DIRECTORY.')
            log.general(err)
            global.die()
          }
          else {
            recursive_mkt()
          }
        })
      }
      else {
        recursive_mkt()
      }
    }
    else {
      cb()
    }
  }

  recursive_mkt()
}
