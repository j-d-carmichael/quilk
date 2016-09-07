var compressor = require('node-minify');

module.exports = {
    run: function( next ){

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
    },

    help: function(){
        var helps = [
            'This is a direct mapping to the node-minify package. Simply pass in 3 things:',
            '1 - The minify type (see the npm node-minify for options)',
            '2 - The input file',
            '3 - The output file',
            'Please see the readme for an example quilk json.'
        ];
        var clc = require('cli-color');
        console.log( clc.bold.underline('node_minify module help - start') );
        for( var key in helps ){
            console.log( helps[key] );
        }
        console.log( clc.bold.underline('node_minify module help - end') );
    }
};