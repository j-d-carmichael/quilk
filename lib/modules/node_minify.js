var compressor = require('node-minify');

module.exports = function( next ){

    new compressor.minify({
        type: global.current_module.type,
        fileIn: global.current_module.input_path,
        fileOut: global.current_module.target,
        callback: function (err, min) {
            if( err ){
                console.log( 'ERROR COMPRESSING THE LIB JAVASCRIPT FILE:' );
                console.log( err );
            } else {
                //run the next module
                return next();
            }
        }
    });
};