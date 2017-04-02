var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    resolve = require('resolve'),
    browserify = require('browserify'),
    babelify = require('babelify');

module.exports = {
    run:  function (next) {

        next = next || function () {};

        var bundleFs = fs.createWriteStream( global.pwd + global.current_module.target );

        console.log( global.pwd );

        //move node into the working directory
        console.log( process.cwd() );
        process.chdir( path.resolve( global.pwd ));
        console.log( process.cwd() );

        //start the browserify
        var b = new browserify({
            transform:    [
                (global.current_module.configure) ? babelify.configure(global.current_module.configure) : babelify
            ],
            extensions:   global.current_module.extensions || ['.js'],
            entries:      [],
            cache:        {},
            packageCache: {},
            debug:        global.current_module.debug ? 'development' : 'production'
        });

        //require all the rel. vendor modules given into browserify
        _.map( global.current_module.npm_modules, function ( mod ) {
            console.log( mod );
            b.require(
                resolve.sync(mod),
                { expose: mod }
            );
        } );

        // Now bundle in all together and write to disk.
        b.bundle().pipe(bundleFs);

        global.logTime('piped and awaiting cb');

        bundleFs.on('finish', function () {

            global.logTime('finished writing the babelify file');

            return next();
        });
    },
    help: function () {}
};