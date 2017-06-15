var fs = require('fs'),
  path = require('path'),
  _ = require('lodash'),
  browserify = require('browserify'),
  babelify = require('babelify')

module.exports = {
  run: function (next) {

    next = next || function () {}

    if (!require('../onlyModuleCheck')('babelify_app')) return next()

    var relProjectPath = global.pwd + ((typeof global.current_module.working_directory !== 'undefined') ? global.current_module.working_directory : '')

    // TODO: Check we are to build the app file. Somehow figure out which files are to be used and then only run if chokidar heard a file change on one of these files.

    var bundlePath = global.pwd + global.current_module.target
    var bundleFs = fs.createWriteStream(bundlePath)

    global.logTime('babelify write stream created')

    if (typeof global.current_module.entries === 'string') {
      global.current_module.entries = relProjectPath + global.current_module.entries
    } else {
      _.forIn(global.current_module.entries, function (value, key) {
        global.current_module.entries[key] = relProjectPath + global.current_module.entries[key]
      })
    }

    var b = new browserify({
      transform: [
        (global.current_module.configure) ? babelify.configure(global.current_module.configure) : babelify
      ],
      extensions: global.current_module.extensions || ['.js'],
      entries: global.current_module.entries || [],
      cache: {},
      packageCache: {},
      debug: global.current_module.debug ? 'development' : 'production'
    })

    //require all the rel. vendor modules given into browserify
    var modules = global.current_module.npm_modules
    if (modules === 'package.json') {
      var packageJson = JSON.parse(fs.readFileSync(relProjectPath + '/package.json', 'utf8'))
      modules = _.chain(packageJson.dependencies)
      .omit(packageJson.bundleExclude)
      .keys()
      .value()
    }

    _.map(modules, function (mod) {
      global.log.general(mod)
      b.external(mod)
    })

    b.bundle().pipe(bundleFs)

    global.logTime('piped and awaiting cb')

    bundleFs.on('finish', function () {

      global.logTime('finished writing the babelify file')

      return next()
    })
  },
  help: function () {
    var helps = [
      'Babel transforms your JavaScript from specific standards to the standard javascript the browsers can read. Google babelify for more.',
      'Checkout the main quilk help for more'
    ]
    var clc = require('cli-color')
    console.log(clc.bold.underline('babelify module help - start'))
    for (var key in helps) {
      console.log(helps[key])
    }

    console.log(clc.bold.underline('babelify module help - end'))
  }
}