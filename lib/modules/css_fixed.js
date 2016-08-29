var fs          = require('fs'),
    path        = require('path');

module.exports = function( cb ){

    if( GLOBAL.chokidarFileChangePath ){
        //vendor scripts are exact, check for an exact match
        if( GLOBAL.current_module.files.indexOf( GLOBAL.chokidarFileChangePath ) !== -1 ){
            console.log( 'Not a bower_components or app js file, skipping app js compile' );
            return cb();
        }
    }

    var files = [];

    for( var i = 0; i < GLOBAL.current_module.files.length ; ++i ){
        var file_name = GLOBAL.pwd + GLOBAL.current_module.files[i];
        try{
            fs.statSync( file_name );
            files.push( file_name );
        } catch( err ){
            //err = no files, log error and abort
            console.log( err );
            console.log( '#####################################################' );
            console.log( 'One or more js files not found, aborting quilk.' );
            console.log( file_name );
            return false;
        }
    }

    //last but not least, concat them all together
    require('concat-files')( files, GLOBAL.pwd + GLOBAL.current_module.target, function() {
        logTime( 'Built vendors file');
        cb();
    });
};