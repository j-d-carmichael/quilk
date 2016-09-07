var clc    = require('cli-color');

module.exports = function( next ){

    global.desktopNotify('Starting the example module', 'Enjoy');

    console.log( clc.bold.red('Hi there!') +  'This is the custom module in action!' );
    console.log('');
    console.log( clc.green.blink('Did you know you can now run me with all the other modules.. just run quilk d=yourname') );
    console.log('');
    console.log( clc.blue.blink('Did you know you can run modules on their own.. just run quilk module=modulename') );
    console.log('');
    console.log('This is the quilk.json object found for this module:');
    console.log(global.current_module);
    console.log('');
    console.log('This is all the li args passed:');
    console.log(global.cliArgs);
    console.log('');
    console.log('This is the quilk.json object found for this module:');
    console.log(global.current_module);
    console.log('');
    console.log('This is the developer object found:');
    console.log( global.quilkConf.developers[ global.cliArgs.developer ] );

    console.log('');
    console.log(clc.bold.blue.blink('Scoll up to see all of the console output from the example module'));

    //run the next module
    next();
};