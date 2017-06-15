var cliArgs = require('jdc-node-cliarg-reader').readAll()

module.exports = function( module ) {

  console.log( cliArgs )

  if (cliArgs.module) {
    if(typeof cliArgs.module === 'string') cliArgs.module = [cliArgs.module];
    if( cliArgs.module.indexOf(module) === -1 ){
      global.log.general('Skipping module "'+module+'" as seen in the modules array pass by the cli args.')
      return false;
    }
  }

  return true;
}