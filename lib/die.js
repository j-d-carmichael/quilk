var releaseRunnerCount = 0;
module.exports = function(  ){
    /**
     * Time to curl up and die.
     */
    if( global.cliArgs.release && releaseRunnerCount == 0){
        ++releaseRunnerCount; // To prevent an infinite loop scenario
        var releaseCommandRunner = require('./release_runner');
        releaseCommandRunner( quilkConf.release_commands_or_modules[cliArgs.release].error, 'error', function(){
            global.log.error( 'Process exiting. Stacktrace: ', true );
            process.exit();
        } );
    } else {
        global.log.error( 'Process exiting. Stacktrace: ', true );
        process.exit();
    }
};