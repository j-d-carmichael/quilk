var fs          = require('fs'),
    readdir     = require('recursive-readdir'),
    path        = require('path'),
    endOfLine   = require('os').EOL,
    naturalSort = require('javascript-natural-sort');

module.exports = function( cb ){

    if( GLOBAL.chokidarFileChangePath ){
        //vendor scripts are exact, check for an exact match
        if( GLOBAL.current_module.include_first.indexOf( GLOBAL.chokidarFileChangePath ) === -1 ){
            if( GLOBAL.current_module.find_in_paths.indexOf( GLOBAL.chokidarFileChangePath ) === -1 ){
                console.log( 'Not a bower_components or app js file, skipping app js compile' );
                return cb();
            }
        }
    }

    var foundFiles = [];

    var ignore_files = [];

    //add the include_first arr
    if( GLOBAL.current_module.include_first ){
        for( var key in GLOBAL.current_module.include_first ){
            foundFiles.push( GLOBAL.pwd + GLOBAL.current_module.include_first[key] );
            ignore_files.push( GLOBAL.current_module.include_first[key].replace(/\\/g,"/").split('/').pop() );
        }
    }

    function recursiveFind( paths, recCb ){
        if( paths.length == 0 ){
            return recCb();
        } else {
            var pathFind = paths.shift();
            //walk through the js_to_compile dir to get all js files
            require('recursive-readdir')( GLOBAL.pwd + pathFind,
                /* ignore these file names */
                ignore_files,
                /* cb once all files aquired */
                function (err, files) {
                //sort the files found in a natural order
                files.sort( naturalSort );
                foundFiles = foundFiles.concat( files );

                recursiveFind( paths, recCb );
            });
        }
    }

    recursiveFind( GLOBAL.current_module.find_in_paths, function(  ){
        var i;
        var files = [];
        //check all the js files actually exist
        for( i=0;i<foundFiles.length ; ++i){
            try{
                fs.statSync( foundFiles[i] );
                files.push( foundFiles[i] );
                files.push( __dirname + '/../resource/spacer.txt' );
            } catch( err ){
                //err = no files, log error and abort
                console.log( err );
                console.log( '#####################################################' );
                console.log( 'One or more js files not found, aborting quick sync: ' + foundFiles[i] );
                return false;
            }
        }

        //last but not least, concat them all together
        require('concat-files')( files, GLOBAL.pwd + GLOBAL.current_module.target, function() {
            logTime( 'Built concatenated js file: ' + GLOBAL.pwd + GLOBAL.current_module.target );
            cb();
        });
    } );
};