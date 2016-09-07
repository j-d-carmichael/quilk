var less = require( 'less' );
var fs = require( 'fs' );
var path = require('path');
var fse = require('fs.extra');

var lessPath    = global.pwd + global.current_module.input_path,
    outputPath  = global.pwd + global.current_module.target;

//inject the folder base dir to the resource paths
if(global.current_module.resourcePaths){
    for( var key in global.current_module.resourcePaths ){
        global.current_module.resourcePaths[key] = global.pwd + global.current_module.resourcePaths[key];
    }
}

//first ensure we have the js folder, and make if not
fse.mkdirp( outputPath.split('/')[0], function (err) {
    if (err) {
        console.log( 'ERROR COULD NOT MAKE THE BASE CSS DIRECTORY.' );
        console.log( err );
        throw "HALT!";    // throw a text
    }
});

module.exports = function( next ){

    if( global.chokidarFileChangePath ){
        if( global.chokidarFileChangePath.indexOf('.less') == -1 ){
            console.log( 'Not a less file' );
            return next();
        }
    }

    logTime( 'Building css file from: ' + lessPath );
    fs.readFile( lessPath ,function(error,data){
        data = data.toString();
        logTime( 'Base less file read, passing to less render' );
        less.render(data, {
            paths: global.current_module.resourcePaths
        },function (e, css) {
            if( e ){
                logTime( e );
                return next();
            }
            logTime( 'CSS compiled, starting write to disk' );
            fs.writeFile( outputPath, css.css, function(err){
                if( err ){
                    console.log( err );
                }
                logTime( 'File written to disk' );
                //now we have built the all.css, append the bower component specific stuff, eg ng-dialog
                return next();
            });
        });
    });
};