var less = require( 'less' ),
    fs = require( 'fs' );

module.exports = {
    run: function( next ){

        if( global.chokidarFileChangePath ){

            global.log.general( global.chokidarFileChangePath );

            if( global.chokidarFileChangePath.indexOf('.less') === -1 ){
                global.log.general( 'Not a less file so skipping this module' );
                return next();
            }
        }

        var lessPath    = global.pwd + global.current_module.input_path,
            outputPath  = global.pwd + global.current_module.target;

        //inject the folder base dir to the resource paths
        if(global.current_module.resourcePaths){
            for( var key in global.current_module.resourcePaths ){
                global.current_module.resourcePaths[key] = global.pwd + global.current_module.resourcePaths[key];
            }
        }

        global.logTime( 'Building css file from: ' + lessPath );
        fs.readFile( lessPath ,function(error,data){
            data = data.toString();
            global.logTime( 'Base less file read, passing to less render' );
            less.render(data, {
                paths: global.current_module.resourcePaths
            },function (e, css) {
                if( e ){
                    global.logTime( e );
                    return next();
                }
                global.logTime( 'CSS compiled, starting write to disk' );
                fs.writeFile( outputPath, css.css, function(err){
                    if( err ){
                        global.log.general( err );
                    }
                    global.logTime( 'File written to disk: ' + outputPath );
                    //now we have built the all.css, append the bower component specific stuff, eg ng-dialog
                    return next();
                });
            });
        });
    },
    help: function(){
        var helps = [
            'This is a straight forward LESS compiler. It uses the native npm less tools. Provide the input file (the one that will include all the rest), a directory to find files in and of course an output file.',
            'The result is a single CSS file in the target you instructed.',
            'Please see the readme for an example quilk json.'
        ];
        var clc = require('cli-color');
        console.log( clc.bold.underline('less_std module help - start') );
        for( var key in helps ){
            console.log( helps[key] );
        }
        console.log( clc.bold.underline('less_std module help - end') );
    }
};
