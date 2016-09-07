var fs = require('fs');
module.exports = function( next ) {

    next = next || function(){};

    // if( chokidarFileChangePath ){
    //     if( chokidarFileChangePath.indexOf('browserify_modules') == -1 ){
    //         console.log( 'Not a browserify_modules js file, skipping browserify_modules js compile' );
    //         return next();
    //     }
    // }

    var bundlePath = global.pwd + global.current_module.target;

    /**
     * Set the browserify to work building the bundles.js file
     */
    var bundleFs = fs.createWriteStream( bundlePath );

    logTime('write stream created');

    var browserify = require('browserify');

    logTime('module loaded');

    var b = browserify({standalone: global.current_module.browserify_bundle_name});
    b.add( global.pwd + global.current_module.browserify_main );
    b.bundle().pipe(bundleFs);

    logTime('piped and awaiting cb');

    bundleFs.on('finish', function () {
        logTime('finished writing the browserify file');
        return next();
    });
};