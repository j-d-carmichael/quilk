var fs = require('fs'),
  readdir = require('recursive-readdir'),
  nodeSass = require('node-sass'),
  naturalSort = require('javascript-natural-sort'),
  endOfLine = require('os').EOL,
  _ = require('lodash'),
  command_run = require('../command_run')

/**
 * A module to search and build the main index.scss then write to disk.
 * @param next This is the next module to be run, or the end of the quilks
 */
module.exports = {
  run: function (next) {

    if (!require('../onlyModuleCheck')('sass_find')) return next()

    if (global.chokidarFileChangePath) {
      if (global.chokidarFileChangePath.indexOf('.scss') === -1) {
        global.log.general('Not a sass file, skipping sass compile')
        return next()
      }
    }

    var ensureLeadingSlash = function( path ){
      if(path.charAt(0) !== '/'){
        path = '/' + path
      }
      return path
    }

    var outputPath = '.' + ensureLeadingSlash(global.current_module.target)
    var baseToAppPath = '.' + ensureLeadingSlash(global.current_module.find_in_path)
    var ignorePaths = global.current_module.ignorePaths

    //we must also add the include first and last files to the ignore arr to prevent duplicates
    var first = global.current_module.include_first || []
    var last = global.current_module.include_last || []

    ignorePaths = ignorePaths.concat(first)
    ignorePaths = ignorePaths.concat(last)

    var sassString = ''
    var scssFiles = []
    var ignoreFunc = function (file, stats) {
      var pathToStrip = baseToAppPath.replace(/\\/g, '/')
      //normalise the slashes
      file = file.replace(/\\/g, '/')
      //strip the base bath
      file = file.replace(pathToStrip, '')
      //ignore the  ignorePaths
      for (var i = 0; i < ignorePaths.length; ++i) {
        if (file === ignorePaths[i]) return false
        if (ignorePaths[i].charAt(0) === '/') ignorePaths[i] = ignorePaths[i].substr(1)
        if (file.indexOf(ignorePaths[i]) !== -1) return false
      }

      if (file.indexOf('.scss') !== -1) {
        //if the file is not already in the
        scssFiles.push(file)
        return true
      }
      else return false

    }
    var findPaths = function (cb) {
      //find all the scss files
      readdir(baseToAppPath, [ignoreFunc], function (err, files) {
        if (err) {
          global.log.error('ERROR')
          global.log.error(err)
        }
        scssFiles.sort(naturalSort)
        return cb(scssFiles)
      })
    }
    var scssFileLooper = function (files, cb) {
      if (files.length > 0) {
        var file = './' + files.shift()
        writeLineToIndexScss('@import "' + file + '";', function () {
          scssFileLooper(files, cb)
        })
      } else {
        cb()
      }
    }
    var writeLineToIndexScss = function (line, cb) {
      sassString += line + endOfLine
      cb()
    }
    var processSassFile = function (cb) {
      try {
        var res = nodeSass.renderSync({
          data: sassString,
          outputStyle: 'expanded',
          sourceComments: true
        })
        return cb(res.css.toString())
      } catch (e) {
        logTime('ERROR: Could not comile SASS:')
        global.desktopNotify('ERROR', 'Could not compile SASS please see the terminal', 10)
        global.log.error(e)
        cb('')
      }
    }
    var writeToFile = function (fileToWriteTo, stringToWrite, cb) {
      fs.writeFile(fileToWriteTo, stringToWrite, function (err) {
        if (err) {
          global.log.error('ERROR')
          global.log.error(err)
          global.desktopNotify('ERROR WITH SASS BUILDER', 'Please see the console.', 10)
        }
        cb()
      })
    }

    var manualAdditions = function (paths, cb) {
      if (paths.length === 0) {
        return cb()
      } else {
        writeLineToIndexScss('@import ".' + ensureLeadingSlash( paths.pop() ) + '";', function () {
          manualAdditions(paths, cb)
        })
      }
    }

    if (global.current_module.verbose_logging) {
      global.logTime('Adding the core files SASS files')
      global.log.general(global.current_module.include_first)
    }

    // 1 include the files files
    manualAdditions(first, function () {

      //2 - find the rest of the scss files for this project within the app directory
      findPaths(function (scssFiles) {
        if (global.current_module.verbose_logging) {
          global.logTime('Paths found: ')
          global.log.general(scssFiles)
        }

        //3 - loop through all the paths adding the @import to the main index.scss
        scssFileLooper(scssFiles, function () {

          // add in the last files
          manualAdditions(last, function () {

            //4 - process the sass file
            processSassFile(function (cssString) {
              global.logTime('SASS compiler completed')

              //5 write to disk
              writeToFile(outputPath, cssString, function () {
                next()
              })
            })
          })
        })
      })
    })
  }
}