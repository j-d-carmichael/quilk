var command_run = false;

function minRequirementCheck( release ){
    if( Array.isArray( release ) || typeof release === 'string' ) {
        return true;
    } else if( typeof release === 'object' ){
        if( release.name && release.module ){
            return true;
        }
    }

    global.log.error( 'ERROR' );
    global.log.general('If your release is a module object, ensure there is at least a name and module string.');
    global.die();
}

function generalPrint( type, msg ){
    if( type != 'complete' && type != 'error'  ) global.log.general( msg );
}

var self = function ( commands, type, cb, count ){
    count = count || 0;
    if( count === 0 ){
        if( type != 'complete' ) global.log.success( type + ' release commands starting.' );
    }
    if( commands.length > 0 ){
        ++count;
        var command = commands.shift();
        minRequirementCheck( command );

        generalPrint(type, '' );
        generalPrint(type, 'RELEASE COMMAND STARTING: ' + command.name );

        if( Array.isArray( command )){
            if( !command_run ){
                command_run = require('./command_run');
            }
            var program = command.shift();

            generalPrint(type,  'Release type: spawn command' );
            generalPrint(type,  program);

            command_run( program, command, function(){
                self(commands, type, cb, count);
            } );
        } else if( typeof command === 'object' ){
            generalPrint(type, 'Release type: quilk module' );
            generalPrint(type, 'Module name: ' + command.module );

            global.build( [command], function(){
                return self(commands, type, cb, count);
            }, true);
        } else if( typeof command === 'string' ){
            generalPrint(type, 'Release type: exec command' );
            generalPrint(type, command );
            var exec = require('child_process').exec;
            exec( command, function( error, stdout, stderr ){
                if( error ){
                    global.log.error( 'ERROR:' );
                    global.log.general( error );
                    global.log.general( stderr );
                    logTime( 'If the max buffer was exceeded, consider running this in array/spawn format as this has no restriction on buffer output' );
                    global.die();
                } else {
                    generalPrint(type, stdout );
                    return self(commands, type, cb, count);
                }
            });
        } else {
            global.log.error('ERROR');
            global.log.general('Release object received in wrong format');
            global.die();
        }
    } else {
        if( type !== 'complete' ) {
            global.log.success( 'All release commands run.' );
            global.log.success( 'CHECK FOR NO ERRORS ABOVE' );
        }
        global.log.general( '' );
        cb();
    }
};

module.exports = self;