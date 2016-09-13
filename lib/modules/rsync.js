var cliarg  = require('jdc-node-cliarg-reader'),
    clc     = require('cli-color');
    spawn   = require('child_process').spawn;

module.exports = {
    run: function( next ){

        var rsyncObj = global.quilkConf.developers[global.cliArgs.developer].rsync;

        logTime( 'Starting rsync...' );

        //don't run this rsync module if the developer conf is set to not do so.
        if( typeof global.quilkConf.developers[ global.cliArgs.developer ].rsync === 'undefined' ){
            console.log('Not running rsync');
            return next();
        }

        var args = ['-avz','--delete' ];

        // For windows
        if(global.quilkConf.developers[global.cliArgs.developer].platform == 'windows'){
            //for windows
            args.push('--chmod=ug=rwx,o=rx');
        }

        // If no "sync_all" flag sent, add the excludes
        if( !global.cliArgs.sync_all ){
            //add the global excludes
            var i;
            if( global.current_module.ignore ){
                if( global.current_module.ignore.global ){
                    for( i=0 ; i < global.current_module.ignore.global.length ; ++i ){
                        args.push('--exclude="'+ global.current_module.ignore.global[i] +'"');
                    }
                }
                if( global.current_module.ignore[ global.quilkConf.developers[global.cliArgs.developer].platform ] ){
                    for( i=0 ; i < global.current_module.ignore[ global.quilkConf.developers[global.cliArgs.developer].platform ].length ; ++i ){
                        args.push('--exclude="'+ global.current_module.ignore[ global.quilkConf.developers[global.cliArgs.developer].platform ][i] +'"');
                    }
                }
            }
        }

        //add the global sets
        if( global.current_module.set ){
            if( typeof global.current_module === 'string' ){
                global.current_module = [global.current_module];
            }
            for(i=0;i<global.current_module.set.length;++i){
                args.push(global.current_module.set[i]);
            }
        }

        //add the developer specific sets
        if( rsyncObj.set ){
            if( typeof rsyncObj.set === 'string' ){
                rsyncObj.set = [rsyncObj.set];
            }
            for(i=0;i<rsyncObj.set.length;++i){
                args.push(rsyncObj.set[i]);
            }
        }


        //if dry run is in the cli args, this will print out what would be run.. but its a dry run so nothing actually runs
        if( global.cliArgs.dryRun ){
            args.push( '--dry-run' );
        }


        if( rsyncObj.port ){
            args.push( '-e "ssh -p'+ rsyncObj.port +'"');
        }

        //add the source and target then run
        args.push( rsyncObj.localPath );
        if( rsyncObj.remote && rsyncObj.remote != ''){
            args.push( rsyncObj.remote  + ':' + rsyncObj.serverPath );
        } else {
            args.push( rsyncObj.serverPath );
        }

        console.log( clc.bold('The rsync args are about to run are:') );
        console.log( args );


        var rsync = spawn('rsync', args);

        rsync.stdout.on('data', function(data)  {
            console.log(' ' + data);
        });

        rsync.stderr.on('data', function(data) {
            console.log(clc.bold.red('Error:'));
            console.log( ' ' + data );
        });

        rsync.on('close', function(code) {
            console.log('Rsync finished with code '+code);
            next();
        });
    },

    help: function(){
        var helps = [
            'A module used to sync your local fileset to somewhere else.',
            'You must ensure both the target and source have rsync installed (rsync is typically installed by default on most unix systems)',
            'In the config you set the global ignores in the rsync module ref in the quilk.json modules array',
            'The rest of the config is generally placed in the developer specific object. Each dev will more the likely have their own local and remote paths',
            '',
            'Why ignore.. it is better to ignore node_modules as different OS\'s have different compiled versions of different packages.',
            'Also, it is better to ignore composer files to for the same reason but also (important for non ssd) to improve speed. Tell rsync to sync 20,000 files and it will but on a std hdd this is slower than on an ssd...',
            'There is also a sync_all option you can pass from the cli, this will sync your entire fileset, after which you can then safely ignore the dependency folders.',
            '',
            'Please see the readme for an example quilk json. This is a direct use of nodejs and not using a 3rd party rsync library'
        ];
        var clc = require('cli-color');
        console.log( clc.bold.underline('rsync module help - start') );
        for( var key in helps ){
            console.log( helps[key] );
        }
        console.log( clc.bold.underline('rsync module help - end') );
    }
};