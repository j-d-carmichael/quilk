var fs = require('fs')
var path = require('path')

module.exports = {
  run: function (next) {

    next = next || function () {}

    if (!require('../onlyModuleCheck')('browserify_bundle')) return next()

    /**
     * Set the browserify to work building the bundles.js file
     */
    var bundleFs = fs.createWriteStream(path.join(global.pwd, global.current_module.target))

    global.logTime('write stream created')

    var browserify = require('browserify')

    global.logTime('browserify module loaded')

    var b = browserify({standalone: global.current_module.browserify_bundle_name})
    b.add(global.pwd + global.current_module.browserify_main)
    b.bundle().pipe(bundleFs)

    global.logTime('piped and awaiting cb')

    bundleFs.on('finish', function () {
      global.logTime('finished writing the browserify file')
      return next()
    })
  }
}
