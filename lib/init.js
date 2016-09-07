var fs  = require('fs.extra'),
    clc = require('cli-color'),
    jsonfile = require('jsonfile');

module.exports = function(){

    if( global.cliArgs.example_module ){

        fs.mkdirRecursive('./quilk_modules/', function(err) {
            if (err) {
                console.log(clc.red.bold('Could not create the quilk_modules folder in your project:'));
                return console.log(err);
            }
            //copy the example module and add the example json conf to the quilk.json of this project
            fs.copy(__dirname + '/resource/example_module.js', './quilk_modules/example_module.js', function (err) {
                if (err) {
                    console.log(clc.red.bold('Could not create quilk_modules/example_module.js file:'));
                    return console.log(err);
                }

                if( !global.quilkConf.modules ){
                    global.quilkConf.modules = [];
                }

                global.quilkConf.modules.push({
                    "name": "Example custom module",
                    "module": "example_module",
                    "path_input": "/private/path/",
                    "path_output": "/public/path/"
                });

                jsonfile.writeFile('./quilk.json', global.quilkConf, {spaces: 2}, function (err, obj) {
                    if (err) {
                        console.log(clc.red.bold('ERROR: The example module has been generated but there was an error registering the module in your quilk.json file:'));
                        return console.log(err);
                    }
                    return console.log(clc.green.bold('Great an example custom module has been generated for you and registered in your quilk.json file.'));
                });
            });
        });
    } else {

        //try to copy the quilk example
        fs.copy(__dirname + '/resource/quilk.json', './quilk.json', function (err) {
            if( err ){
                console.log( clc.red.bold( 'Could not create quilk.json file:' ) );
                console.log( err );
            } else {
                console.log( clc.green.bold( 'quilk.json file generated and stored at the root of your project.' ) );
                console.log( clc.green.bold( 'The default developer has been entered, please tune accordingly.' ) );
            }
        });
    }
};