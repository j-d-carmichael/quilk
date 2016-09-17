var clc = require('cli-color');

module.exports = {
    run: function( next ){

        global.desktopNotify('This is just for fun.', 'Enjoy');

        global.log.general( clc.bold('Hi there!') +  'This is the sample module.' );
        global.log.general('');
        global.log.general('I do not actually do anything except console log stuff.');
        global.log.general('');
        global.log.general('You see me being used in the quilk.json modules array');

        if( global.current_module.print_this ){
            global.log.general('');
            global.log.general('My only dynamic job is to print what is in the "print_this" section from my bit of the quilk.json');
            global.log.general( global.current_module.print_this );
        }

        //run the next module
        next();
    },
    help : function(){
        var helps = [
            'This is just a demo module to, well... demo a module.',
            'This module is automatically injected into the quilk.json file after running "quilk init"'
        ];

        var clc = require('cli-color');
        console.log( clc.bold.underline('just_for_fun.js module help - start') );
        for( var key in helps ){
            console.log( helps[key] );
        }
        console.log( clc.bold.underline('just_for_fun.js module help - end') );
    }
};