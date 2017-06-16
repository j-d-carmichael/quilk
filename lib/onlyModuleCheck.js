var cliArgs = require('jdc-node-cliarg-reader').readAll()

module.exports = function (module) {
  if (cliArgs.module) {
    if (typeof cliArgs.module === 'string') cliArgs.module = [cliArgs.module]
    if (cliArgs.module.indexOf(module) === -1) {
      global.log.general('Skipping module "' + module + '" as modules array passed by the cli args and this module is not present.')
      return false
    }
  }
  return true
}