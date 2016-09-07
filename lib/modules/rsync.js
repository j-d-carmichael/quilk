var exec    = require('child_process').exec,
    cliarg  = require('jdc-node-cliarg-reader');

module.exports = function( next ){

    logTime( 'Starting rsync...' );

    global.cliArgs = cliarg.readAll();
    if( global.cliArgs.d ){
        global.cliArgs.developer = global.cliArgs.d;
    }

    if(!global.quilkConf.developers[ global.cliArgs.developer ]){
        logTime( 'Sorry the developer you passed via cli does not exist in the ./config/rsync.js config file. Aborting rsync.', 'bold', 'red' );
        return;
    }

    //don't run this rsync module if the developer conf is set to not do so.
    if( typeof global.quilkConf.developers[ global.cliArgs.developer ].rsync === 'undefined' ){
        console.log('Not running rsync');
        return next();
    }

    //for macs
    var rsyncCommand = 'rsync -avz --delete ';
    if(global.quilkConf.developers[global.cliArgs.developer].platform == 'windows'){
        //for windows
        rsyncCommand = 'rsync -avz --delete --chmod=ug=rwx,o=rx ';
    }

    //if no "sync_all" flag sent, add the excludes
    if( !global.cliArgs.sync_all ){
        //add the global excludes
        var i;
        for( i=0 ; i < global.current_module.ignore.global.length ; ++i ){
            rsyncCommand += '--exclude "'+ global.current_module.ignore.global[i] +'" ';
        }
        //now add the ignores specific to the os this dev is running on, eg macs node modules are a tad different from windows and ubuntu it seems so need to be ignored
        for( i=0 ; i < global.current_module.ignore[ global.quilkConf.developers[global.cliArgs.developer].platform ].length ; ++i ){
            rsyncCommand += '--exclude "'+ global.current_module.ignore[ global.quilkConf.developers[global.cliArgs.developer].platform ][i] +'" ';
        }
    }

    //if dry run is in the cli args, this will print out what would be run.. but its a dry run so nothing actually runs
    if( global.cliArgs.dryRun ){
        rsyncCommand += '--dry-run ';
    }

    var rsyncObj = global.quilkConf.developers[global.cliArgs.developer].rsync;

    if( rsyncObj.port ){
        rsyncCommand += '-e "ssh -p'+ rsyncObj.port +'" ';
    }

    //add the source and target then run
    rsyncCommand += rsyncObj.localPath + ' ' + rsyncObj.remote  + ':' + rsyncObj.serverPath;

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

            return next();
        }
    });
};