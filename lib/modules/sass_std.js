var fs       = require('fs'),
    nodeSass = require('node-sass');

module.exports = {
    run: function( next ){

        if( global.chokidarFileChangePath ){
            if(global.chokidarFileChangePath.indexOf('.scss') === -1 ){
                global.log.general( 'Not a sass file, skipping this module' );
                return next();
            }
        }

        var scssPath    = global.pwd + global.current_module.input_path,
            outputPath  = global.pwd + global.current_module.target;

        nodeSass.render({
            file: scssPath,
            outFile: outputPath,
            outputStyle: global.current_module.outputStyle,
            sourceComments: global.current_module.sourceComments
        }, function( err, result ){

            //this is the complete function that runs after the css file has been written to the buffer
            if( err ){
                global.log.error('ERROR:');
                global.log.error( err );
                return next();
            }

            fs.writeFile(outputPath, result.css.toString() , function(err) {
                global.log.general( 'Built css file to: ' + outputPath );

                if( typeof global.current_module.include_css === 'object' ){
                    if( global.current_module.include_css.length  > 0){
                        var i;
                        for(i = 0 ; i < global.current_module.include_css.length ; ++ i){
                            global.current_module.include_css[i] = global.pwd + global.current_module.include_css[i];
                        }

                        global.log.general( 'Adding additional CSS files to the compiled SASS generated CSS file: ' );
                        global.log.general(  global.current_module.include_css );

                        var addOnCSS = [outputPath].concat( global.current_module.include_css );

                        //check all the js files actually exist
                        for(i=0;i<addOnCSS.length ; ++i){
                            try{
                                fs.statSync( addOnCSS[i] )
                            } catch( err ){
                                //err = no files, log error and abort
                                logTime( 'ERROR: CSS file not found in the sass_std module.' );
                                global.log.error( err );
                                return next();
                            }
                        }

                        //now we have built the all.css, append the bower component specific stuff, eg ng-dialog
                        require('concat-files')( addOnCSS, outputPath, function() {
                            global.log.general( 'CSS files concatenated with the generate css file.' );
                            return next();
                        });
                    } else {
                        return next();
                    }
                } else {
                    return next();
                }
            });
        });
    },

    help: function(){
        var helps = [
            'The sass std is exactly the same as the less std, except as the name suggests... it is for sass.',
            'Provide and in and an out and that\'s about it. Assuming your main input .scss file includes all the rest this module does not need anything else',
            '',
            'Please the see the node-sass npm page for the options available, any you want to use just drop them into your quilk.json and they will be passed to node-sass',
            'For example, pass "outputStyle": "expanded" and the css will be expanded',
            'Pass "sourceComments": true and the css output will contain comments to their original file.',
            '',
            'Please see the readme for an example quilk json.'
        ];
        var clc = require('cli-color');
        console.log( clc.bold.underline('sass_find module help - start') );
        for( var key in helps ){
            console.log( helps[key] );
        }
        console.log( clc.bold.underline('sass_find module help - end') );
    }
};
