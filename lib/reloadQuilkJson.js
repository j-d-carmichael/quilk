var jsonfile = require('jsonfile')

module.exports = function (cb) {
  var quilkConf
  var cliArgs = global.cliArgs
  if (cliArgs.input) {
    var pathToLoad = path.join(pwd, cliArgs.input)
    if (cliArgs.input.indexOf('.json') !== -1) {
      try {
        quilkConf = global.quilkConf = jsonfile.readFileSync(pathToLoad)
      } catch (e) {
        console.error('Input file not found: ' + pathToLoad)
        die()
      }
    } else {
      try {
        quilkConf = global.quilkConf = require(pathToLoad)
      } catch (e) {
        console.error('Input file not found: ' + pathToLoad)
        die()
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
        die()
      }
    }
  }
  if (cb) {
    cb(quilkConf)
  } else {
    return quilkConf
  }
}