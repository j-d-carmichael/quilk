var fs       = require('fs'),
    nodeSass = require('node-sass');

module.exports = function( next ){

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
};