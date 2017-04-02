var compressor = require('node-minify');

var self = {
    run: function( next ){

        //normalise the paths for node minifyer
        if( typeof global.current_module.input !== 'string' ){
            for( var i=0; i<global.current_module.input.length ;++i ){
                global.current_module.input[i] = global.pwd + global.current_module.input[i];
            }
        } else {
            global.current_module.input = global.pwd + global.current_module.input;
        }

        global.current_module.target =  global.pwd + global.current_module.target;

        if( global.current_module.type === 'babili' ){
            require('../directory_walk')( global.pwd + '/node_modules', function( data ){
                if( data.indexOf( global.pwd + '/node_modules/node-minify') === -1  ){

                    global.log.error( 'You need to install node-minify locally' );

                    // process.chdir( global.pwd );
                    // var cmd = require('../command_run');
                    // cmd('npm', ['install', 'node-minify'], function(){
                        self.compress(next);
                    // });
                } else {
                    self.compress(next);
                }
            } );
        } else {
            self.compress(next)
        }
    },

    compress: function( next ){
        var minifyObject = {
            compressor: global.current_module.type,
            input: global.current_module.input,
            output: global.current_module.target,
            callback: function (err, min) {
                if( err ){
                    global.log.error( 'ERROR COMPRESSING THE FILE:' );
                    global.log.general( err );
                }
                //run the next module
                return next();
            }
        };
        if( global.current_module.options ) minifyObject.options = global.current_module.options;

        compressor.minify( minifyObject );
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
module.exports = self;