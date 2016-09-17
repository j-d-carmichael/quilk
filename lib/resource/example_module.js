var clc    = require('cli-color');

module.exports = {
    run: function( next ){

        global.desktopNotify('Starting the example module', 'Enjoy');

        global.log.general( clc.bold.red('Hi there!') +  'This is the custom module in action!' );
        global.log.general('');
        global.log.general('This is the quilk.json object found for this module:');
        global.log.general(global.current_module);
        global.log.general('');
        global.log.general('This is all the li args passed:');
        global.log.general(global.cliArgs);
        global.log.general('');
        global.log.general('This is the quilk.json object found for this module:');
        global.log.general(global.current_module);
        global.log.general('');
        global.log.general('This is the developer object found:');
        global.log.general( global.quilkConf.developers[ global.cliArgs.developer ] );

        global.log.general('');
        global.log.general(clc.bold.blue.blink('Scoll up to see all of the console output from the example module'));

        //run the next module
        next();
    },
    help : function(){
        var helps = [
            'This is the help function form the example custom module :)',
            'Have a look at the module code.. just open /quilk_modules/example_module.js and take a look.. it is not as complex as you might think :)',
            'All the functional code goes in the run function and the help for other people goes int the help function.. thats it :)',
        ];

        var clc = require('cli-color');
        global.log.general( clc.bold.underline('example_module module help - start') );
        for( var key in helps ){
            global.log.general( helps[key] );
        }
        global.log.general( clc.bold.underline('example_module module help - end') );
    }
};