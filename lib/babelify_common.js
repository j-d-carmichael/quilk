var Browserify = require('browserify')
var babelify   = require('babelify')
var fs         = require('fs')
var path       = require('path')

module.exports = {
  base: function () {
    return {
      browserify: Browserify({
        transform   : [
          (global.current_module.configure) ? babelify.configure(global.current_module.configure) : babelify
        ],
        extensions  : global.current_module.extensions || ['.js'],
        entries     : global.current_module.entries || [],
        cache       : {},
        packageCache: {},
        debug       : global.current_module.debug ? 'development' : 'production'
      }),
      writeStream: fs.createWriteStream(path.join(global.pwd, global.current_module.target))
    }
  }
}
