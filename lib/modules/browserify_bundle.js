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
            'For example, if you had a module.exports file you were using at the server in a nodejs project, you could package the module for use at the browser.',
            'The obvious benefit with this is that you have one file of code to maintain. A typical use case for this would be form validators.',
            '',
            'Here is an example module object for your quilk.json file:',
            {
                "name": "Browserify files",
                "module" : "browserify_bundle",
                "browserify_main": "/public/browserify_modules/browserifyMain.js",
                "browserify_bundle_name": "bfyModules",
                "target" : "/public/js/bundle.js"
            },
            '',
            'In the above example, the module reads a file called browserifyMain.js and then creates a nice object called bfyModules and outputs the code into a file called bundle.js',
            '',
            'Here is an example of what your browserifyMain.js might look like:',
            '"use strict";  module.exports = { formValidator : require(\'./formValidator\'), validators : require( \'./validators\')};',
            '',
            'Call the bundle.js into the head of your html file.',
            'Now to access in the browser say a function from the validators module, simply call "bfyModules.validators.isString( variable )"'
        ];
        var clc = require('cli-color');
        console.log( clc.bold.underline('browserify_bundle module help - start') );
        for( var key in helps ){
            console.log( helps[key] );
        }
        console.log( clc.bold.underline('browserify_bundle module help - end') );
    }
};
