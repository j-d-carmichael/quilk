var compressor = require('node-minify');

module.exports = function( cb ){

    new compressor.minify({
        type: GLOBAL.current_module.type,
        fileIn: GLOBAL.current_module.input_path,
        fileOut: GLOBAL.current_module.target,
        callback: function (err, min) {
            if( err ){
                console.log( 'ERROR COMPRESSING THE LIB JAVASCRIPT FILE:' );
                console.log( err );
            } else {
                //run the next module
                return cb();
            }
        }
    });
};