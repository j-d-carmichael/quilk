var babelify_common = require('../babelify_common')

module.exports = {
  run: function (next) {

    next = next || function () {}

    if( !require('../onlyModuleCheck')('babelify') ) return next()

    // Create a simple babel, no exposing or excluding
    var babel = babelify_common.base()
    babel.browserify.bundle().pipe(babel.writeStream)
    global.logTime('piped and awaiting cb')

    // Write the file and move onto next()
    babel.writeStream.on('finish', function () {
      global.logTime('finished writing the babelify file')
      return next()
    })
  }
}