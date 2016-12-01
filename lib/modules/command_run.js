var fs      = require('fs'),
    path    = require('path'),
    spawn   = require('child_process').spawn,
    clc     = require('cli-color');

module.exports = {
    run: function( next ){

        var command = spawn(global.current_module.program, global.current_module.arguments || [] );

        command.stdout.on('data', function(data)  {
            global.log.general(' ' + data);
        });

        command.stderr.on('data', function(data) {
            global.log.general(clc.bold.red('Error:'));
            global.log.general( ' ' + data );
        });

        command.on('close', function(code) {
            global.log.general( global.current_module.program + ' finished with code ' + code);
            next();
        });
    },
    help: function(){
        var helps = [
            'command_run is fairly straight forward... pass in a program with & optionally some arguments and this module will run it... ',
            'Please see the quilk readme file for an example.'
        ];
        var clc = require('cli-color');
        global.log.general( clc.bold.underline('css_fixed module help - start') );
        for( var key in helps ){
            global.log.general( helps[key] );
        }
        global.log.general( clc.bold.underline('css_fixed module help - end') );
    }
};
