var compressor = require('node-minify')
var path = require('path')

module.exports = {
  run: function (next) {

    if (!require('../onlyModuleCheck')('node_minify')) return next()

    //normalise the paths for node minifyer
    if (typeof global.current_module.input !== 'string') {
      for (var i = 0; i < global.current_module.input.length; ++i) {
        global.current_module.input[i] = path.join(global.pwd, global.current_module.input[i])
      }
    } else {
      global.current_module.input = path.join(global.pwd, global.current_module.input)
    }

    global.current_module.target = path.join(global.pwd, global.current_module.target)

    var minifyObject = {
      compressor: global.current_module.type,
      input: global.current_module.input,
      output: global.current_module.target,
      callback: function (err, min) {
        if (err) {
          global.log.error('ERROR COMPRESSING THE FILE:')
          global.log.general(err)
          global.die()
        }
        //run the next module
        return next()
      }
    }
    if (global.current_module.options) minifyObject.options = global.current_module.options

    compressor.minify(minifyObject)
  }
}