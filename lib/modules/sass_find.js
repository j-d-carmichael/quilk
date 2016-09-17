var fs          = require('fs'),
    naturalSort = require('javascript-natural-sort'),
    endOfLine   = require('os').EOL;

/**
 * A module to search and build the main index.scss then write to disk.
 * @param next This is the next module to be run, or the end of the quilks
 */
module.exports = {
    run: function( next ) {
        if( global.chokidarFileChangePath ){
            if( global.chokidarFileChangePath.indexOf('.scss') == -1 ){
                global.log.general( 'Not a sass file, skipping sass compile' );
                return next();
            }
        }

        var scssPath        = './_index_quilk.scss',
            outputPath      = '.' + global.current_module.target,
            baseToAppPath   = '.' + global.current_module.find_in_path,
            ignorePaths     = global.current_module.ignorePaths.push('_index_quilk.scss');

        var scssFiles = [];
        var ignoreFunc = function(file, stats) {
            var pathToStrip = baseToAppPath.replace(/\\/g,"/");
            //normalise the slashes
            file = file.replace(/\\/g,"/");
            //strip the base bath
            file = file.replace( pathToStrip, '' );
            //ignore the  ignorePaths
            for( var i=0;i<ignorePaths.length;++i ){
                if( file.indexOf(ignorePaths[i]) !== -1 ){
                    return false;
                }
            }

            if( file.indexOf('.scss') !== -1 ){
                //if the file is not already in the
                scssFiles.push( file );
                return true;
            } else {
                return false;
            }
        };
        var findPaths = function( cb ){
            //find all the scss files
            readdir( baseToAppPath, [ignoreFunc], function (err, files) {
                if( err ){
                    global.log.error('ERROR');
                    global.log.general( err );
                }
                scssFiles.sort(naturalSort);
                return cb( scssFiles );
            });
        };
        var scssFileLooper = function( files, cb ){
            if( files.length > 0 ){
                var file = './' + files.shift();
                writeLineToIndexScss('@import "'+ file +'";',function(){
                    scssFileLooper( files, cb );
                });
            } else {
                cb( );
            }
        };
        var writeLineToIndexScss = function( line, cb ){
            fs.appendFile( scssPath, line + endOfLine , function (err) {
                if( err ){
                    global.log.error('ERROR');
                    global.log.general( err );
                }
                cb();
            });
        };
        var processSassFile = function( file, cb ){
            nodeSass.render({
                file: scssPath,
                outputStyle: 'expanded',
                sourceComments: true
            }, function( err, result ) {
                if( err ){
                    global.log.error('ERROR');
                    global.log.general( err );
                    global.desktopNotify({
                        'title': 'ERROR WITH SASS BUILDER',
                        'message': 'Please see the console.'
                    });
                }
                return cb( result.css.toString() );
            })
        };
        var writeToFile = function( fileToWriteTo, stringToWrite, cb ){
            fs.writeFile(fileToWriteTo, stringToWrite, function (err) {
                if( err ){
                    global.log.error('ERROR');
                    global.log.general( err );
                    global.desktopNotify({
                        'title': 'ERROR WITH SASS BUILDER',
                        'message': 'Please see the console.'
                    });
                }
                logTime('Added the bower component css files to the all.css');
                cb();
            });
        };

        var include_first = function( paths, cb ){
            if( paths.length == 0 ){
                return cb();
            } else {
                var path = paths.pop();
                writeLineToIndexScss( '@import ".'+ path +'";', function(){
                    include_first( paths, cb );
                });
            }
        };

        //0 - empty the current index.scss file
        fs.open(scssPath, 'w', function(err, fd) {
            global.logTime( 'Created the base index.scss file' );
            include_first( global.current_module.include_first, function(){
                global.logTime( 'Existing css file emptied' );
                //2 - now find the rest of the scss files for this project within the app directory
                findPaths(function( scssFiles ){
                    global.logTime( 'Paths found: ' );
                    global.log.general( scssFiles );
                    //3 - loop through all the paths adding the @import to the main index.scss
                    scssFileLooper( scssFiles, function(  ){
                        global.logTime( 'master index.scss file built' );
                        //4 - process the sass file
                        processSassFile( scssPath, function( cssString ){
                            global.logTime( 'SASS compiler completed' );
                            //5 - last but not least, write the css to file
                            writeToFile( outputPath, cssString, function(){
                                global.logTime( 'CSS written to disk' );
                                fs.unlink(scssPath, function(){
                                    //6 - run the main callback of the module
                                    next();
                                })
                            } );
                        } );
                    } );
                });
            });
        });
    },

    help: function(){
        var helps = [
            'The sass_find... this is a little different to the std sass module.',
            'It is by nature a little slower as it must.. well.. find.',
            '',
            'The idea is simple, provide the module a starting point, maybe a core.scss file that might include all the sites variables and mixins etc etc',
            'Then provide it path to search for .scss files in.',
            'The output will be a single css file containing the core stuff at the top and the rest under.',
            '',
            'Please the see the node-sass npm page for the options available, any you want to use just drop them into your quilk.json and they will be passed to node-sass',
            'For example, pass "outputStyle": "expanded" and the css will be expanded',
            'Pass "sourceComments": true and the css output will contain comments to their original file.',
            '',
            'Please see the readme for an example quilk json.'
        ];
        var clc = require('cli-color');
        console.log( clc.bold.underline('sass_find module help - start') );
        for( var key in helps ){
            console.log( helps[key] );
        }
        console.log( clc.bold.underline('sass_find module help - end') );
    }
};