var clc = require('cli-color');

var log = {

    backtrace: function(){
        try {
            invalidfunctionthrowanerrorplease();
        } catch(err) {
            var logStack = err.stack.split('\n');
        }

        var fullTrace = [];
        for( var i = 3 ; i < logStack.length ; ++i ){
            fullTrace.push(logStack[i].replace(/\s+/g, ' ') );
        }
        console.log( fullTrace );
    },
    error: function( m, b){
        console.log( clc.bold.red( m ) );
        if( b ){
            log.backtrace();
        }
    },
    success: function( m, b ){
        console.log( clc.bold.green( m ) );
        if( b ){
            log.backtrace();
        }
    },
    general: function( m ){
        console.log( m  );
    }
};

module.exports = log;