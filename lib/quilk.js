process.bin = process.title = 'quilk';

/**
 * Load in the nodejs modules required for quick sync to run
 */
var path   = require('path'),
    cliarg = require('jdc-node-cliarg-reader'),
    pwd    = global.pwd = process.cwd(),
    _      = require('lodash'),
    clc    = require('cli-color');

/**
 * The following is to place into the global namespace logTime
 * This is useful for logging to the terminal from within any of the quilk modules
 */
var time = global.time = function time(){
    return (new Date()).getTime() / 1000;
};
var start = global.start = time();
var logTime = global.logTime = function( message, style1, style2 ){
    style1 = style1 || false;
    style2 = style2 || false;
    if( style1 && !style2 ){
        message = clc[style1]( '---- ' + message );
    } else if ( style1 && style2 ){
        message = clc[style1][style2]( '---- ' + message );
    }
    console.log( ' ' );
    console.log( message );
    console.log( 'Time ' + runningTime() + 's');
};
var runningTime = function(){
    return _.round( Number(time()) - Number(start), 3);
};

/**
 * Read all the command line arguments into quilk
 */
var cliArgs = global.cliArgs = cliarg.readAll();

/**
 * Setup the notifier based on the quilk.json settings
 */
var desktopNotify = global.desktopNotify = require('./notify');

/*
 * Show stoppers
 */
if( cliArgs.help ) return require('./print_help')();

/**
 * Sorting out the d/developer shortcuts and fallback to default
 */
if( cliArgs.d ) cliArgs.developer = global.cliArgs.developer = cliArgs.d;
if( !cliArgs.developer ) cliArgs.developer = global.cliArgs.developer = 'default';


//setting the global var chokidarFileChangePath for all modules to query
var chokidarFileChangePath = global.chokidarFileChangePath = false;

/**
 * Try to include the quilk.json file
 */
try{
    var quilkConf = global.quilkConf = require( pwd + '/quilk.json');
} catch ( e ){
    if( cliArgs.init ) return require('./init')();
    return console.log( clc.bold.red('quilk.json not found or could not be read') );
}

/**
 * Check we have a developer object in the quilk.json
 */
if( typeof quilkConf.developers === 'undefined' ) return console.log( clc.bold.red('ERROR: Please pass a valid developer to quilk or ensure a default developer is created'));

/**
 * Check we have a valid developer
 */
if( !quilkConf.developers[cliArgs.developer] && !cliArgs.release ){
    console.log(clc.bold.red('ERROR: You have not passed a valid developer. Please enter a valid developer from the quilk.json file'));
    console.log('(If you did not pass a developer in the cli arguments then you must create a developer titled default. Please see the lib/resource/quilk.json on quilk github or run `quilk init`)');
    return false
}

/**
 * Init or not
 */
if( cliArgs.init ) return require('./init')();

/**
 * The release flag was passed, check we have a valid release option to run
 */
if( cliArgs.release ) {
    if( !quilkConf.release_commands[cliArgs.release] ) return console.log( clc.bold.red('ERROR: You have entered release with no valid option'));
}

/**
 * Now set up the release object for the usual quilk modules to run without error
 */
if( !quilkConf.developers[cliArgs.developer] && cliArgs.release ) {
    cliArgs.developer = global.cliArgs.developer = 'release';
    quilkConf.developers['release'] = global.quilkConf.developers['release'] = {
        notifier: {
            on: false
        },
        rsync : false
    };
}

/**
 * The release command runner
 */
function releaseCommandRunner( commands, cb ){
    if( commands.length > 0 ){
        var command = commands.shift();
        var exec = require('child_process').exec;
        console.log( 'RELEASE COMMAND RUNNING: ' + command );
        exec( command, function( error, stdout, stderr ){
            if( error ){
                console.log( 'ERROR:' );
                console.log( error );
                console.log( stderr );
                console.log( 'ERROR' );
            } else {
                console.log( stdout );
                return releaseCommandRunner(commands, cb);
            }
        })
    } else {
        console.log( 'All release commands run. Now running callback.' );
        cb();
    }
}

/**
 * The ignore function is run on each file found from the readdir function.
 * If the return is false then the file is not passed to the final array in the cb.
 * Only js files are passed in this case.
 * @param file
 * @param stats
 * @returns {boolean}
 */
function ignoreFunc(file, stats) {
    return (path.basename(file).indexOf('.js') === -1);
}

/**
 * The build function called by the watcher
 */
var building = false;
var waiting = false;
var haltBuild = false;
function build( cb ) {

    start = time();

    if(!cliArgs.quiet){
        desktopNotify( 'Running quick sync ', ' ' );
    }

    //walk through the files running one at a time
    var lastModule = '';
    function runquilks(modules) {
        building = true;
        if (modules.length > 0) {
            if(!haltBuild){
                //try load the quilk module
                global.current_module = modules.shift();
                var file = './modules/' + global.current_module.module;
                try{
                    module = require( file );
                    logTime( 'Running ' + file, 'bold' );
                    if( global.current_module.name ) console.log( clc.bold( 'Quilk module named: ' + global.current_module.name ) );

                    lastModule = file;
                    module(function () {
                        runquilks(modules);
                    });
                } catch( e ){
                    //try load from the custom project module
                    file =  pwd + '/quilk_modules/' + global.current_module.module;
                    console.log( file );
                    try{
                        module = require( file );
                        logTime( 'Running ' + file, 'bold' );
                        if( global.current_module.name ) console.log( clc.bold('Quilk module named: ' + global.current_module.name) );
                        lastModule = file;
                        module(function () {
                            runquilks(modules);
                        });
                    } catch ( e2 ) {
                        console.log(clc.bold.red('ERROR finding module'));
                        logTime( e );
                        return logTime( e2 );
                    }
                }
            } else {
                console.log( ' ');
                console.log( clc.bold.red('Halting the quilk and starting again as another file change has been heard by old Mr Chokidar') );
                console.log( ' ');
                console.log( ' ');
                building = false;
                haltBuild = false;
            }
        } else {
            building = false;
            haltBuild = false;
            console.log('  ');
            console.log('  ');
            logTime('Total time to run Mrs Quilks (& your) modules: ' + runningTime() + 'seconds', 'bold' );
            if(!cliArgs.quiet){
                desktopNotify( 'quilk finished', 'Total time: ' + runningTime() + 'seconds');
            }

            if( cb ){
                cb();
            }
        }
    }

    //anndd go.
    runquilks( _.cloneDeep( quilkConf.modules ) );
}

/**
 * Function to ignore special file endings generated by ide's
 * @param path
 * @returns {boolean}
 */
var file_endings_ignore_array = ['___jb_tmp___', '_index_quilk', '.idea', '.git', 'quilk.json'];
if( quilkConf['dont_watch'] ){
    file_endings_ignore_array = file_endings_ignore_array.concat( quilkConf['dont_watch'] );
}

var watch_ignore_func = function( path ) {
    for( var key in file_endings_ignore_array ){
        if( path.indexOf( file_endings_ignore_array[key] ) !== -1 ){
            return false;
        }
    }
    return true;
};

/**
 * The watcher function
 */
var watcher = function(){
    if( cliArgs.watch ){

        var runOnEvents = [
            "add",
            "change",
            "unlink"
        ];

        if( quilkConf.run_on_events ){
            runOnEvents = runOnEvents.concat( quilkConf.run_on_events );
        }

        var Spinner = require('cli-spinner').Spinner;

        console.log( ' ' );
        console.log( ' ' );
        logTime( 'Adding project files to be watched', 'bold' );

        var spinner = new Spinner('Please wait... %s');
        spinner.setSpinnerString(7);
        spinner.start();


        var allAdded = false;

        if(!cliArgs.quiet) {
            desktopNotify('Adding the files to watch', 'This may take up to 10 seconds. Wait for the console to stop flickering.');
        }
        // One-liner for current directory, ignores .dotfiles
        require('chokidar').watch( global.pwd, {
            persistent: true
        })
        .on('ready', function(){
            allAdded = true;
            spinner.stop( );
            console.log( ' Great, your project is now being watched... :)' );
            console.log( 'Time ' + runningTime() + 's');
            console.log( ' ' );
            console.log( ' ' );
            if(!cliArgs.quiet){
                desktopNotify( ' Great!', 'Your project is now being watched... :)' );
            }
        })
        .on('all', function (event, path) {
            if (runOnEvents.indexOf(event) !== -1 && allAdded ) {

                global.chokidarFileChangePath = path.replace(/\\/g,"/");

                if( watch_ignore_func( global.chokidarFileChangePath ) ) {
                    if( waiting ){
                        console.log( 'Already waiting for a previous queue to finish.' );
                    } else {
                        console.log('Event "' + event + '" heard on path: ' + path );
                        if( building ){
                            waiting = true;
                            console.log( 'quilk already in progress, waiting.' );
                            haltBuild = true;
                            //now wait for the previous builds to finish before starting a new one.
                            var interaval = setInterval(function(){
                                if( !building ){
                                    clearInterval( interaval );
                                    waiting = false;
                                    build();
                                }
                            },500);
                        } else {
                            build();
                        }
                    }
                }
            }
        });
    }
};

//if releasing, run the release command before running the quilk modules
if (cliArgs.release) {
    console.log('RELEASE COMMANDS TO RUN: ');
    console.log(quilkConf.release_commands[cliArgs.release]);
    //trigger the release commands
    releaseCommandRunner(quilkConf.release_commands[cliArgs.release], function () {
        build();
    });
}
//not release, just run the build and pass in the watcher as the callback (this will only watch is the watch cli command has been passed.
else {
    build(function() {
        watcher();
    });
}