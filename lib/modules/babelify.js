var fs = require('fs'),
    browserify = require('browserify'),
    babelify = require('babelify');

module.exports = {
    run:  function (next) {

        next = next || function () {};

        var bundlePath = global.pwd + global.current_module.target;
        var bundleFs = fs.createWriteStream(bundlePath);

        global.logTime('babelify write stream created');

        browserify({
            transform:    [
                (global.current_module.configure) ? babelify.configure(global.current_module.configure) : babelify
            ],
            extensions:   global.current_module.extensions || ['.js'],
            entries:      global.current_module.entries || [],
            cache:        {},
            packageCache: {},
            debug:        global.current_module.debug ? 'development' : 'production'
        }).bundle().pipe(bundleFs);

        global.logTime('piped and awaiting cb');

        bundleFs.on('finish', function () {

            global.logTime('finished writing the babelify file');

            return next();
        });
    },
    help: function () {
        var helps = [
            'Babel transforms your JavaScript from specific standards to the standard javascript the browsers can read. Google babelify for more.',
            'Checkout the main quilk help for more'
        ];
        var clc = require('cli-color');
        console.log(clc.bold.underline('babelify module help - start'));
        for (var key in helps) {
            console.log(helps[key]);
        }

        console.log(clc.bold.underline('babelify module help - end'));
    }
};