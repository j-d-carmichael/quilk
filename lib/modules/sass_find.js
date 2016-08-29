var fs          = require('fs');
var basePath    = __dirname + '/..';
var nodeSass    = require('node-sass');
var naturalSort = require('javascript-natural-sort');
var path        = require('path');
var readdir     = require('recursive-readdir');
var endOfLine   = require('os').EOL;

var scssPath        = './_index_quilk.scss',
    outputPath      = '.' + GLOBAL.current_module.target,
    baseToAppPath   = '.' + GLOBAL.current_module.find_in_path,
    ignorePaths     = GLOBAL.current_module.ignorePaths.push('_index_quilk.scss');

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
            console.log( err );
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
            console.log( err );
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
            console.log( 'Error with string:');
            console.log( err );
            desktopNotify({
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
            console.log( err );
            desktopNotify({
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

/**
 * A module to search and build the main index.scss then write to disk.
 * @param callback
 */
module.exports = function( callback ) {
    callback = callback || false;

    if( GLOBAL.chokidarFileChangePath ){
        if( GLOBAL.chokidarFileChangePath.indexOf('.scss') == -1 ){
            console.log( 'Not a sass file, skipping sass compile' );
            return callback();
        }
    }

    //0 - empty the current index.scss file
    fs.open(scssPath, 'w', function(err, fd) {
        logTime( 'Created the base index.scss file' );
        include_first( GLOBAL.current_module.include_first, function(){
            logTime( 'Existing css file emptied' );
            //2 - now find the rest of the scss files for this project within the app directory
            findPaths(function( scssFiles ){
                logTime( 'Paths found: ' );
                console.log( scssFiles );
                //3 - loop through all the paths adding the @import to the main index.scss
                scssFileLooper( scssFiles, function(  ){
                    logTime( 'master index.scss file built' );
                    //4 - process the sass file
                    processSassFile( scssPath, function( cssString ){
                        logTime( 'SASS compiler completed' );
                        //5 - last but not least, write the css to file
                        writeToFile( outputPath, cssString, function(){
                            logTime( 'CSS written to disk' );
                            fs.unlink(scssPath, function(){
                                //6 - run the main callback of the module
                                callback();
                            })
                        } );
                    } );
                } );
            });
        });
    });
};