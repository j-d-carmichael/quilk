var fs          = require('fs'),
    readdir     = require('recursive-readdir'),
    nodeSass    = require('node-sass'),
    naturalSort = require('javascript-natural-sort'),
    endOfLine   = require('os').EOL,
    command_run = require('../command_run');

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
            baseToAppPath   = '.' + global.current_module.find_in_path;
        global.current_module.ignorePaths.push('_index_quilk.scss');
        var ignorePaths = global.current_module.ignorePaths;
        var sassString = '';
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
                    global.log.error( err );
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
            sassString += line + endOfLine;
            cb();
        };
        var processSassFile = function( cb ){
            try{
                var res = nodeSass.renderSync({
                    data: sassString,
                    outputStyle: 'expanded',
                    sourceComments: true
                });
                return cb( res.css.toString() );
            } catch( e ){
                logTime( 'ERROR: Could not comile SASS:' );
                global.desktopNotify('ERROR', 'Could not compile SASS please see the terminal', 10);
                global.log.error( e );
                cb( '' );
            }
        };
        var writeToFile = function( fileToWriteTo, stringToWrite, cb ){
            fs.writeFile(fileToWriteTo, stringToWrite, function (err) {
                if( err ){
                    global.log.error('ERROR');
                    global.log.error( err );
                    global.desktopNotify( 'ERROR WITH SASS BUILDER', 'Please see the console.', 10);
                }
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

        if( global.current_module.verbose_logging ){
            global.logTime( 'Adding the core files SASS files' );
            global.log.general( global.current_module.include_first );
        }

        include_first( global.current_module.include_first, function(){
            //2 - now find the rest of the scss files for this project within the app directory
            findPaths(function( scssFiles ){
                if( global.current_module.verbose_logging ) {
                    global.logTime( 'Paths found: ' );
                    global.log.general( scssFiles );
                }
                //3 - loop through all the paths adding the @import to the main index.scss
                scssFileLooper( scssFiles, function(  ){
                    //4 - process the sass file
                    processSassFile(function( cssString ){
                        global.logTime( 'SASS compiler completed' );
                        writeToFile( outputPath, cssString, function(){
                            next();
                        } );
                    } );
                } );
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