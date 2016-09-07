var exec    = require('child_process').exec,
    cliarg  = require('jdc-node-cliarg-reader');

module.exports = {
    run: function( next ){

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
    },

    help: function(){
        var helps = [
            'A module used to sync your local fileset to somewhere else.',
            'You must ensure both the target and source have rsync installed (rsync is installed by default on most unix systems)',
            'In the config you set the global ignores in the rsync module ref in the quilk.json modules array',
            'The rest of the config is generally placed in the developer specific object. Each dev will more the likely have their own local and remote paths',
            '',
            'Why ignore.. it is better to ignore node_modules as different OS\'s have different compiled versions of different packages.',
            'Also, it is better to ignore composer files to for the same reason but also (important for non ssd) to improve speed. Tell rsync to sync 20,000 files and it will but on a std hdd this is slower than on an ssd...',
            'There is also a sync_all option you can pass from the cli, this will sync your entire fileset, after which you can then safely ignore the dependency folders.',
            '',
            'Please see the readme for an example quilk json.'
        ];
        var clc = require('cli-color');
        console.log( clc.bold.underline('rsync module help - start') );
        for( var key in helps ){
            console.log( helps[key] );
        }
        console.log( clc.bold.underline('rsync module help - end') );
    }
};