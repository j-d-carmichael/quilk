var fse = require('fs.extra');

module.exports = function( modules, cb ){
  var module_t;
  function recursive_mkt(){
    if( modules.length > 0 ){
      module_t = modules.pop();
      if( module_t.target ){
        var outputPath = global.pwd + module_t.target;
        outputPath = outputPath.split('/');
        outputPath.pop();
        outputPath = outputPath.join('/');
        //first ensure we have the less folder, and make if not
        fse.mkdirp( outputPath, function (err) {
            if (err) {
                console.log( 'ERROR COULD NOT MAKE THE BASE JS DIRECTORY.' );
                console.log( err );
                process.exit();
            } else {
              recursive_mkt();
            }
        });
      } else {
        recursive_mkt();
      }
    } else {
      cb();
    }
  }
  recursive_mkt( );
};
