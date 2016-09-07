var clc    = require('cli-color'),
    jsonfile = require('jsonfile');

module.exports = function(){

    jsonfile.readFile( __dirname + '/../package.json', function (err, obj) {
        if( err ){
            console.log( clc.bold.red('ERROR: Could not read the package.json of quilk:') );
            return console.log( err );
        }

        console.log( clc.bold('Quilk version: ') );
        process.stdout.write(clc.move.right(5));
        console.log( obj.version );
        console.log( clc.bold('Quilk dependencies: ') );
        for( var key in obj.dependencies ){
            process.stdout.write(clc.move.right(5));
            console.log( key  + ' : ' + obj.dependencies[key]);
        }
    });
};