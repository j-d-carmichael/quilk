var fs          = require('fs');
var basePath    = __dirname + '/..';
var nodeSass    = require('node-sass');
var naturalSort = require('javascript-natural-sort');
var path        = require('path');
var readdir     = require('recursive-readdir');
var endOfLine   = require('os').EOL;

var scssPath        = basePath + '/public/index.scss',
    outputPath      = basePath + '/public/css/index.css',
    baseToAppPath   = basePath + '/public/app/',
    ignorePaths = [
        "core/scss",
        "index.scss"
    ];

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
    readdir(basePath + '/public/app/', [ignoreFunc], function (err, files) {
        if( err ){
            log( err );
        }
        scssFiles.sort(naturalSort);
        return cb( scssFiles );
    });
};
var scssFileLooper = function( files, cb ){
    if( files.length > 0 ){
        var file = files.shift();
        file = file.split('/app/')[1];
        writeLineToIndexScss('@import "./app/'+ file +'";',function(){
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

/**
 * A module to search and build the main index.scss then write to disk.
 * @param callback
 */
module.exports = function( callback ) {
    callback = callback || false;

    if( chokidarFileChangePath ){
        if(chokidarFileChangePath.indexOf('.scss') == -1 ){
            console.log( 'Not a sass file, skipping sass compile' );
            return callback();
        }
    }

    //0 - empty the current index.scss file
    fs.truncate(scssPath, 0, function(){
        logTime( 'Existing css file emptied' );
        //1 - write the core global.scss file as an import to the main index.scss
        writeLineToIndexScss( '@import "./app/core/scss/global.scss";', function(){
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
                            //6 - run the main callback of the module
                            callback();
                        } );
                    } );
                } );
            });
        });
    });
};