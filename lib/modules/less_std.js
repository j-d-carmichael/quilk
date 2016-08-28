//Follow this guide to compile less via node when there is time: http://onedayitwillmake.com/blog/2013/03/compiling-less-from-a-node-js-script/
var less = require( 'less' );
var fs = require( 'fs' );
var path = require('path');

var basePath = __dirname + '/..';

var lessPath    = basePath + '/resources/assets/less/xenon.less',
    outputPath  = basePath + '/public/css/app.css';

//first ensure we have the js folder, and make if not
var fse = require('fs.extra');
fse.mkdirp(basePath + '/public/css', function (err) {
    if (err) {
        console.log( 'ERROR COULD NOT MAKE THE BASE JAVASCRIPT DIRECTORY.' );
        console.log( err );
        throw "HALT!";    // throw a text
    }
});

module.exports = function( callback ){

    callback = callback || function(){};

    if( cliArgs.sync_only ){
        console.log( 'Syncing only' );
        return callback();
    }

    if( chokidarFileChangePath ){
        if(chokidarFileChangePath.indexOf('.less') == -1 ){
            console.log( 'Not a less file' );
            return callback();
        }
    }

    console.log( 'Running less module' );

    var bowerCssFilesToAdd = [
        //if required, add any bower css files herre and they will be added to the compiled less file.
        //Or simply add the css you required into the less folder, just make sure the file ext is .less and not .css
    ];

    logTime( 'Building css file from: ' + lessPath );
    fs.readFile( lessPath ,function(error,data){
        data = data.toString();
        logTime( 'Base less file read, passing to less render' );
        less.render(data, {
            paths: [ basePath + '/resources/assets/less/' ]
        },function (e, css) {
            if( e ){
                logTime( e );
                return callback();
            }
            logTime( 'CSS compiled, starting write to disk' );
            fs.writeFile( outputPath, css.css, function(err){
                if( err ){
                    console.log( err );
                }
                logTime( 'File written to disk' );

                bowerCssFilesToAdd.push(outputPath);

                //now we have built the all.css, append the bower component specific stuff, eg ng-dialog
                require('concat-files')( bowerCssFilesToAdd, outputPath, function() {
                    //if not release, just copy the file to all.min.js
                    if( !cliArgs.release){
                        logTime('Added the bower component css files to the all.css');
                        return callback();
                    } else {
                        //COMPRESSING THE LESS... doesn't work on staging, just return
                        return callback();

                        //
                        var compressor = require('node-minify');
                        // Using YUI Compressor for CSS
                        new compressor.minify({
                            type: 'sqwish',
                            fileIn: outputPath,
                            fileOut: outputPath,
                            callback: function (err, min) {
                                if (err) {
                                    console.log('ERROR COMPRESSING THE CSS:');
                                    console.log(err);
                                } else {
                                    //run the next module
                                    return callback();
                                }
                            }
                        });
                    }
                });
            });
        });
    });
};