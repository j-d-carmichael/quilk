var fs      = require('fs'),
    path    = require('path');

module.exports = {
    run: function( next ){

        if( global.chokidarFileChangePath ){
            //vendor scripts are exact, check for an exact match
            if( global.current_module.files.indexOf( global.chokidarFileChangePath ) !== -1 ){
                global.log.general( 'Not in the static list of CSS files so skipping this module.' );
                return next();
            }
        }

        var files = [];

        for( var i = 0; i < global.current_module.files.length ; ++i ){
            var file_name = global.pwd + global.current_module.files[i];
            try{
                fs.statSync( file_name );
                files.push( file_name );
                files.push( __dirname + '/../resource/spacer.txt' );
            } catch( err ){
                //err = no files, log error and abort
                global.log.error( 'ERROR' );
                global.log.general( err );
                global.log.general( '#####################################################' );
                global.log.general( 'One or more js files not found, aborting quilk.' );
                global.log.general( file_name );
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
        global.log.general( clc.bold.underline('css_fixed module help - start') );
        for( var key in helps ){
            global.log.general( helps[key] );
        }
        global.log.general( clc.bold.underline('css_fixed module help - end') );
    }
};
