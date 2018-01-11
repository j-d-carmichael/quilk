var fs      = require('fs')
var _       = require('lodash')
var resolve = require('resolve')
var path = require('path')
var babelify_common = require('../babelify_common')

module.exports = {
  run: function (next) {

    next = next || function () {}

    if (!require('../onlyModuleCheck')('babelify_vendor')) return next()

    var relProjectPath = global.pwd + ((typeof global.current_module.working_directory !== 'undefined') ? global.current_module.working_directory : '')

    //require all the rel. vendor modules given into browserify
    var modules = global.current_module.npm_modules
    if (modules === 'package.json') {
      var packageJson = JSON.parse(fs.readFileSync(path.join(relProjectPath, 'package.json'), 'utf8'))
      modules         = _.chain(packageJson.dependencies)
        .omit(packageJson.bundleExclude)
        .keys()
        .value()
    }

    //check if we should be running this module now
    if (global.chokidarFileChangePath !== false) {
      var run = false
      _.map(modules, function (mod) {
        if (global.chokidarFileChangePath.indexOf(mod) !== -1) run = true
      })

      if (!run) {
        global.log.general('Not running babelify_vendor module file change not found in dependencies')
        return next()
      }
    }

    // Create the babelify and write instance
    var babel = babelify_common.base()

    // Expose the modules required for the vendor file
    _.map(modules, function (mod) {
      babel.browserify.require(
        resolve.sync(relProjectPath + '/node_modules/' + mod),
        {expose: mod}
      )
    })

    // Now bundle in all together and write to disk.
    babel.browserify.bundle().pipe(babel.writeStream)
    global.logTime('piped and awaiting cb')

    // Finish up and continue to the next
    babel.writeStream.on('finish', function () {
      global.logTime('finished writing the babelify file')
      return next()
    })
  }
}