var clc    = require('cli-color');

module.exports = {
    run: function( next ){

        global.desktopNotify('This is just for fun.', 'Enjoy');

        console.log( clc.bold('Hi there!') +  'This is the sample module.' );
        console.log('');
        console.log('I do not actually do anything except console log stuff.');
        console.log('');
        console.log('You see me being used in the quilk.json modules array');

        if( global.current_module.print_this ){
            console.log('');
            console.log('My only dynamic job is to print what is in the "print_this" section from my bit of the quilk.json');
            console.log( global.current_module.print_this );
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