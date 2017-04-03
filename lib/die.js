var releaseRunnerCount = 0;
module.exports = function(  ){
    /**
     * Time to curl up and die.
     */
    if( global.cliArgs.release && releaseRunnerCount === 0){
        ++releaseRunnerCount; // To prevent an infinite loop scenario
        var releaseCommandRunner = require('./release_runner');
        if( quilkConf.release_commands_or_modules[cliArgs.release].error ){
            releaseCommandRunner( quilkConf.release_commands_or_modules[cliArgs.release].error, 'error', function(){
                global.log.error( 'Process exiting. Stacktrace: ', true );
                process.exit();
            } );
        } else {
            global.log.error( 'Process exiting. Stacktrace: ', true );
            process.exit();
        }
    } else {
        global.log.error( 'Process exiting. Stacktrace: ', true );
        process.exit();
    }

    global.desktopNotify('Quilk die called', 'please see the terminal', 10);
};