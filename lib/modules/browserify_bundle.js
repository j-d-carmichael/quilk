var fs = require('fs');
module.exports = {
    run: function( next ) {

        next = next || function(){};

        // if( chokidarFileChangePath ){
        // todo build a catch to prevent the browserify module running when it is not needed
        // }

        var bundlePath = global.pwd + global.current_module.target;

        /**
         * Set the browserify to work building the bundles.js file
         */
        var bundleFs = fs.createWriteStream( bundlePath );

        global.logTime('write stream created');

        var browserify = require('browserify');

        global.logTime('browserify module loaded');

        var b = browserify({standalone: global.current_module.browserify_bundle_name});
        b.add( global.pwd + global.current_module.browserify_main );
        b.bundle().pipe(bundleFs);

        global.logTime('piped and awaiting cb');

        bundleFs.on('finish', function () {
            global.logTime('finished writing the browserify file');
            return next();
        });
    },
    help: function(){
        var helps = [
            'Browserify is a powerfull tool which in this quilk module takes a std javascript module and packages it in a way that the client (browser can read)',
            'Checkout the main quilk help for more'
        ];
        var clc = require('cli-color');
        console.log( clc.bold.underline('browserify_bundle module help - start') );
        for( var key in helps ){
            console.log( helps[key] );
        }
        console.log( clc.bold.underline('browserify_bundle module help - end') );
    }
};
