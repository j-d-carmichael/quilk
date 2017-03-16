var fs = require('fs-extra');

module.exports = {
    run: function (next) {
        global.log.general( 'Clearing out the target.' );
        fs.emptyDir( global.pwd + global.current_module.target, function (err) {
            if (err) {
                global.desktopNotify('quilk error', 'please see the terminal', 10);
                global.log.error( 'ERROR' );
                global.log.error( 'Could not empty directory before copying!' );
                global.log.error( err );
                next();
            } else {
                global.log.general( 'Copying in the source.' );
                fs.copy(global.pwd + global.current_module.source, global.pwd + global.current_module.target, function (err) {
                    if( err ){
                        global.desktopNotify('quilk error', 'please see the terminal', 10);
                        global.log.error( 'ERROR' );
                        global.log.error( 'Could not copy!' );
                        global.log.error( err );
                    } else {
                        logTime( 'Copied the source to the target: ' + global.pwd + global.current_module.target + ' >>> ' + global.pwd + global.current_module.source );
                    }

                    next();
                });
            }
        });
    },

    help: function(){
        var helps = [
            'A simple module to copy a folder and the contents to a new destination.'
        ];
        var clc = require('cli-color');
        console.log( clc.bold.underline('copy module help - start') );
        for( var key in helps ){
            console.log( helps[key] );
        }
        console.log( clc.bold.underline('copy module help - end') );
    }
};