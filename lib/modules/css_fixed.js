var fs          = require('fs'),
    path        = require('path');

module.exports = {
    run: function( next ){

        if( global.chokidarFileChangePath ){
            //vendor scripts are exact, check for an exact match
            if( global.current_module.files.indexOf( global.chokidarFileChangePath ) !== -1 ){
                console.log( 'Not a bower_components or app js file, skipping app js compile' );
                return next();
            }
        }

        var files = [];

        for( var i = 0; i < global.current_module.files.length ; ++i ){
            var file_name = global.pwd + global.current_module.files[i];
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
        require('concat-files')( files, global.pwd + global.current_module.target, function() {
            logTime( 'Built vendors file');
            next();
        });
    },
    help: function(){
        var helps = [
            'css_fixed is a very simple module, is takes a numeric array of files and simply (in order of the array) reads their content into a single file.',
            'Please see the quilk readme file for an example.'
        ];
        var clc = require('cli-color');
        console.log( clc.bold.underline('css_fixed module help - start') );
        for( var key in helps ){
            console.log( helps[key] );
        }
        console.log( clc.bold.underline('css_fixed module help - end') );
    }
};