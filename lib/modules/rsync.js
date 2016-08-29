var exec = require('child_process').exec;

module.exports = function( callback ){

    callback = callback || function(){};
    logTime( 'Starting rsync...' );

    //allowing for shortcuts
    if( GLOBAL.cliArgs.d ){
        GLOBAL.cliArgs.developer = GLOBAL.cliArgs.d;
    }

    if(!GLOBAL.quilkConf.developers[ GLOBAL.cliArgs.developer ]){
        logTime( 'Sorry the developer you passed via cli does not exist in the ./config/rsync.js config file. Aborting rsync.' );
        return;
    }

    //don't run this rsync module if the developer conf is set to not do so.
    if( typeof GLOBAL.quilkConf.developers[ GLOBAL.cliArgs.developer ].rsync === 'undefined' ){
        console.log('not running rsync');
        return callback();
    }

    //for macs
    var rsyncCommand = 'rsync -avz --delete ';
    if(GLOBAL.quilkConf.developers[GLOBAL.cliArgs.developer].platform == 'windows'){
        //for windows
        rsyncCommand = 'rsync -avz --delete --chmod=ug=rwx,o=rx ';
    }

    //if no "sync_all" flag sent, add the excludes
    if( !GLOBAL.cliArgs.sync_all ){
        //add the global excludes
        var i;
        for( i=0 ; i < GLOBAL.current_module.ignore.global.length ; ++i ){
            rsyncCommand += '--exclude "'+ GLOBAL.current_module.ignore.global[i] +'" ';
        }
        //now add the ignores specific to the os this dev is running on, eg macs node modules are a tad different from windows and ubuntu it seems so need to be ignored
        for( i=0 ; i < GLOBAL.current_module.ignore[ GLOBAL.quilkConf.developers[GLOBAL.cliArgs.developer].platform ].length ; ++i ){
            rsyncCommand += '--exclude "'+ GLOBAL.current_module.ignore[ GLOBAL.quilkConf.developers[GLOBAL.cliArgs.developer].platform ][i] +'" ';
        }
    }

    //if dry run is in the cli args, this will print out what would be run.. but its a dry run so nothing actually runs
    if( GLOBAL.cliArgs.dryRun ){
        rsyncCommand += '--dry-run ';
    }

    //add the source and target then run
    rsyncCommand += GLOBAL.quilkConf.developers[GLOBAL.cliArgs.developer].localPath + ' ' + GLOBAL.quilkConf.developers[GLOBAL.cliArgs.developer].remote  + ':' + GLOBAL.quilkConf.developers[GLOBAL.cliArgs.developer].serverPath;

    console.log( 'The rsync command about to run is:' );
    console.log( rsyncCommand );

    /**
     * Last but not least, run the rsync command
     * todo change this to a method that outputs when the command outputs instead of only outputting after the command has finished
     */
    exec( rsyncCommand, function( error, stdout, stderr ){
        if( error ){
            console.log( 'ERROR:' );
            console.log( error );
            console.log( stderr );
            logTime( 'If the max buffer was exceeded, just run the sync again.' );
        } else {
            console.log( stdout );
            logTime( 'NB: node modules ignored in the rsync file will need to be rebuilt on the server manually.' );

            return callback();
        }
    });
};