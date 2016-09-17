var fs          = require('fs'),
    readdir     = require('recursive-readdir'),
    log         = require('../log'),
    naturalSort = require('javascript-natural-sort'),
    recursive_d = require('recursive-readdir');

module.exports = {
    run: function( next ){
        var foundFiles = [],
          ignore_files = [];

        // TODO fix this bit :)
        // if( global.chokidarFileChangePath ){
        //     //vendor scripts are exact, check for an exact match
        //     if( global.current_module.include_first.indexOf( global.chokidarFileChangePath ) === -1 ){
        //         if( global.current_module.find_in_paths.indexOf( global.chokidarFileChangePath ) === -1 ){
        //             console.log( 'Not a bower_components or app js file, skipping app js compile' );
        //             return next();
        //         }
        //     }
        // }

        //add the include_first arr
        if( global.current_module.include_first ){
            for( var key in global.current_module.include_first ){
                foundFiles.push( global.pwd + global.current_module.include_first[key] );
                ignore_files.push( global.current_module.include_first[key].replace(/\\/g,"/").split('/').pop() );
            }
        }

        function recursiveFind( paths, recCb ){
            if( paths.length == 0 ){
                return recCb();
            } else {
                var pathFind = paths.shift();
                //walk through the js_to_compile dir to get all js files
                recursive_d( global.pwd + pathFind,
                    /* ignore these file names */
                    ignore_files,
                    /* recCb once all files acquired */
                    function (err, files) {
                        if( err ){
                          logTime( 'ERROR: Error with the recursive file finder in the js_find module' );
                          global.log.general( err );
                          process.exit();
                        }
                        //sort the files found in a natural order
                        files.sort( naturalSort );
                        foundFiles = foundFiles.concat( files );

                        recursiveFind( paths, recCb );
                    });
            }
        }

        recursiveFind( global.current_module.find_in_paths, function(  ){
            var i,
                files = [];
            //check all the js files actually exist
            for( i=0;i<foundFiles.length ; ++i){
                try{
                    fs.statSync( foundFiles[i] );
                    files.push( foundFiles[i] );
                    files.push( __dirname + '/../resource/spacer.txt' );
                } catch( err ){
                    //err = no files, log error and abort
                    global.log.general( err );
                    global.log.error( '#####################################################' );
                    global.log.error( 'One or more js files not found, aborting quick sync: ' + foundFiles[i] );
                    return false;
                }
            }

            //last but not least, concat them all together
            require('concat-files')( files, global.pwd + global.current_module.target, function() {
                logTime( 'Built concatenated js file: ' + global.pwd + global.current_module.target );
                next();
            });
        } );
    },

    help: function(){
        var helps = [
            'js_find is a module that will find any javascript files in an array of directories provided and add them (sorted naturally) into a single js file.',
            'The result will not a be a minified file, just simple a concatenated file, which is perfect for development as this build time is blazingly fast!',
            '',
            'You can also instruct this module to set specific files to the top of the output file, for example your vendors eg jQuery or Angular',
            'Please see the readme for an example quilk json.'
        ];
        var clc = require('cli-color');
        console.log( clc.bold.underline('js_find module help - start') );
        for( var key in helps ){
            console.log( helps[key] );
        }
        console.log( clc.bold.underline('js_find module help - end') );
    }
};
