var exec = require('child_process').exec;

module.exports = function( callback ){

    callback = callback || function(){};
    logTime( 'Starting rsync...' );

    //allowing for shortcuts
    if( cliArgs.d ){
        cliArgs.developer = cliArgs.d;
    }

    if(!quickSyncConf.developers[ cliArgs.developer ]){
        logTime( 'Sorry the developer you passed via cli does not exist in the ./config/rsync.js config file. Aborting rsync.' );
        return;
    }

    //don't run this rsync module if the developer conf is set to not do so.
    if( !quickSyncConf.developers[ cliArgs.developer ].rsync ){
        console.log('not running rsync');
        return callback();
    }

    //for macs
    var rsyncCommand = 'rsync -avz --delete ';
    if(quickSyncConf.developers[cliArgs.developer].platform == 'windows'){
        //for windows
        rsyncCommand = 'rsync -avz --delete --chmod=ug=rwx,o=rx ';
    }

    //if no "sync_all" flag sent, add the excludes
    if( !cliArgs.sync_all ){
        //add the global excludes
        var i;
        for( i=0 ; i < quickSyncConf.rsync_ignores.global.length ; ++i ){
            rsyncCommand += '--exclude "'+ quickSyncConf.rsync_ignores.global[i] +'" ';
        }
        //now add the ignores specific to the os this dev is running on, eg macs node modules are a tad different from windows and ubuntu it seems so need to be ignored
        for( i=0 ; i < quickSyncConf.rsync_ignores[ quickSyncConf.developers[cliArgs.developer].platform ].length ; ++i ){
            rsyncCommand += '--exclude "'+ quickSyncConf.rsync_ignores[ quickSyncConf.developers[cliArgs.developer].platform ][i] +'" ';
        }
    }

    //if dry run is in the cli args, this will print out what would be run.. but its a dry run so nothing actually runs
    if( cliArgs.dryRun ){
        rsyncCommand += '--dry-run ';
    }

    //add the source and target then run
    rsyncCommand += quickSyncConf.developers[cliArgs.developer].localPath + ' ' + quickSyncConf.developers[cliArgs.developer].remote  + ':' + quickSyncConf.developers[cliArgs.developer].serverPath;

    console.log( 'The rsync command about to run is:' );
    console.log( rsyncCommand );

    /**
     * Last but not least, run the rsync command
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