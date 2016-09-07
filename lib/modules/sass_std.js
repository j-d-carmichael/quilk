var fs       = require('fs'),
    nodeSass = require('node-sass');

module.exports = {
    run: function( next ){

        if( global.chokidarFileChangePath ){
            if(global.chokidarFileChangePath.indexOf('.sass') == -1 ){
                console.log( 'Not a sass file, skipping sass compile' );
                return callback();
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
                console.log( err );
                return console.log( '^^^ Sorry there was an error compiling the scss file ^^^' );
            }

            fs.writeFile(outputPath, result.css.toString() , function(err) {
                console.log( 'Built css file to: ' + outputPath );
                return next();
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