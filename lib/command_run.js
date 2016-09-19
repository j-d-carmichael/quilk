var spawn = require('child_process').spawn,
    clc     = require('cli-color');

module.exports = function( program, args, next ){
    var command = spawn(program, args);

    command.stdout.on('data', function(data)  {
        global.log.general(' ' + data);
    });

    command.stderr.on('data', function(data) {
        global.log.general(clc.bold.red('Error:'));
        global.log.general( ' ' + data );
    });

    command.on('close', function(code) {
        global.log.general( program + ' finished with code ' + code);
        next();
    });
};