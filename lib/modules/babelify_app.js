var fs              = require('fs')
var path            = require('path')
var _               = require('lodash')
var babelify_common = require('../babelify_common')

module.exports = {
  run: function (next) {

    next = next || function () {}

    if (!require('../onlyModuleCheck')('babelify_app')) {
      return next()
      // TODO: Check we are to build the app file. Somehow figure out which files are to be used and then only run if chokidar heard a
      // file change on one of these files. Build a cache of the used files.
    }

    global.logTime('babelify write stream created')

    var relProjectPath = path.join(global.pwd, (typeof global.current_module.working_directory !== 'undefined') ? global.current_module.working_directory : '')

    // Add the relProjectPath to the entries, this bypasses directory issues seem on some os's
    if (typeof global.current_module.entries === 'string') {
      global.current_module.entries = path.join(relProjectPath, global.current_module.entries)
    }
    else {
      _.forIn(global.current_module.entries, function (value, key) {
        global.current_module.entries[key] = path.join(relProjectPath, global.current_module.entries[key])
      })
    }

    var babel = babelify_common.base()

    // Require all the rel. vendor modules given into browserify
    var modules = global.current_module.npm_modules
    if (modules === 'package.json') {
      var packageJson = JSON.parse(fs.readFileSync(path.join( relProjectPath, '/package.json'), 'utf8'))
      modules         = _.chain(packageJson.dependencies)
        .omit(packageJson.bundleExclude)
        .keys()
        .value()
    }

    // Map all the found modules as external mods: available, but not bundled here.
    _.map(modules, function (mod) {
      babel.browserify.external(mod)
    })

    babel.browserify.bundle().pipe(babel.writeStream)
    global.logTime('piped and awaiting cb')

    // Write file and move onto next
    babel.writeStream.on('finish', function () {
      global.logTime('finished writing the babelify file')
      return next()
    })
  }
}