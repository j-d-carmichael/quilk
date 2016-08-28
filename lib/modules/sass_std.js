var fs       = require('fs'),
    nodeSass = require('node-sass');

module.exports = function( callback ){

    if( GLOBAL.chokidarFileChangePath ){
        if(GLOBAL.chokidarFileChangePath.indexOf('.sass') == -1 ){
            console.log( 'Not a sass file, skipping sass compile' );
            return callback();
        }
    }

    var scssPath    = GLOBAL.pwd + GLOBAL.current_module.input_path,
        outputPath  = GLOBAL.pwd + GLOBAL.current_module.target;

    nodeSass.render({
        file: scssPath,
        outFile: outputPath,
        outputStyle: GLOBAL.current_module.outputStyle,
        sourceComments: GLOBAL.current_module.sourceComments
    }, function( err, result ){

        //this is the complete function that runs after the css file has been written to the buffer
        if( err ){
            console.log( err );
            return console.log( '^^^ Sorry there was an error compiling the scss file ^^^' );
        }

        fs.writeFile(outputPath, result.css.toString() , function(err) {
            console.log( 'Built css file to: ' + outputPath );
            if( typeof callback === 'function' ) callback();
        });
    });
};