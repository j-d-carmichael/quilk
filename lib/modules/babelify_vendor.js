var fs = require('fs'),
  path = require('path'),
  _ = require('lodash'),
  resolve = require('resolve'),
  browserify = require('browserify'),
  babelify = require('babelify')

module.exports = {
  run: function (next) {

    next = next || function () {}

    if (!require('../onlyModuleCheck')('babelify_vendor')) return next()

    var relProjectPath = global.pwd + ((typeof global.current_module.working_directory !== 'undefined') ? global.current_module.working_directory : '')

    //require all the rel. vendor modules given into browserify
    var modules = global.current_module.npm_modules
    if (modules === 'package.json') {
      var packageJson = JSON.parse(fs.readFileSync(relProjectPath + '/package.json', 'utf8'))
      modules = _.chain(packageJson.dependencies)
      .omit(packageJson.bundleExclude)
      .keys()
      .value()
    }

    //check if we should be running this module now
    if (global.chokidarFileChangePath !== false) {
      var run = false
      _.map(modules, function (mod) {
        if (global.chokidarFileChangePath.indexOf(mod) !== -1) {
          run = true
        }
      })

      if (!run) {
        global.log.general('Not running babelify_vendor module file change not found in dependencies')
        return next()
      }
    }

    var bundleFs = fs.createWriteStream(global.pwd + global.current_module.target)

    //start the browserify
    var b = new browserify({
      transform: [
        (global.current_module.configure) ? babelify.configure(global.current_module.configure) : babelify
      ],
      extensions: global.current_module.extensions || ['.js'],
      entries: [],
      cache: {},
      packageCache: {},
      debug: global.current_module.debug ? 'development' : 'production'
    })

    global.log.general('Requiring the node modules:')

    _.map(modules, function (mod) {
      b.require(
        resolve.sync(relProjectPath + '/node_modules/' + mod),
        {expose: mod}
      )
    })

    // Now bundle in all together and write to disk.
    b.bundle().pipe(bundleFs)

    global.logTime('piped and awaiting cb')

    bundleFs.on('finish', function () {

      global.logTime('finished writing the babelify file')

      return next()
    })
  },
  help: function () {

    console.log('Checkout the online guides. But here is an example:')
    console.log({
      name: 'Vendor Files babelify',
      working_directory: '/src/browser_app',
      module: 'babelify',
      npm_modules: [
        'jquery',
        'lodash',
        'd3'
      ],
      configure: {
        babelrc: '.babelrc'
      },
      target: '/public/build/js/vendorb.js'
    })
  }
}