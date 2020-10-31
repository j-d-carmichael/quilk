require('colors')
var jsonfile = require('jsonfile')
var path = require('path')

module.exports = function (cb) {
  var quilkConf
  var cliArgs = global.cliArgs
  console.log('')
  if (cliArgs.input) {
    var pathToLoad = path.join(pwd, cliArgs.input)

    if (cliArgs.input.indexOf('.json') !== -1) {
      try {
        quilkConf = global.quilkConf = jsonfile.readFileSync(pathToLoad)
      } catch (e) {
        console.error('Input file not found: '.red + pathToLoad)
        process.exit()
      }
    } else {
      try {
        quilkConf = global.quilkConf = require(pathToLoad)
      } catch (e) {
        console.error('Input file not found: '.red + pathToLoad)
        process.exit()
      }
    }
  } else {
    try {
      quilkConf = global.quilkConf = jsonfile.readFileSync(pwd + '/quilk.json')
    } catch (e1) {
      try {
        quilkConf = global.quilkConf = require(pwd + '/quilk.js')
      } catch (e2) {
        log.error('Could not load either a quilk.js or quilk.json file:')
        log.general(e1)
        log.general(e2)
        process.exit()
      }
    }
  }
  if (cb) {
    cb(quilkConf)
  } else {
    return quilkConf
  }
}