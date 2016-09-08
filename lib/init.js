var fs  = require('fs.extra'),
    q   = require('q'),
    log = require('./log'),
    jsonfile = require('jsonfile');

module.exports = function(){
    function create_quilk(){
        var defer = q.defer();
        //try to copy the quilk example
        fs.copy(__dirname + '/resource/quilk.json', './quilk.json', function (err) {
            if( err ){
                log.error( 'Could not create quilk.json file:' );
                log.general( err );
                defer.reject();
            } else {
                log.success( 'quilk.json file generated and stored at the root of your project.' );
                log.success( 'The default developer has been entered, please tune accordingly.' ) ;
                global.quilkConf = require( global.pwd + '/quilk.json');
                defer.resolve();
            }
        });
        return defer.promise;
    }

    function create_exampleModule(){
        var defer = q.defer();
        fs.mkdirRecursive('./quilk_modules/', function(err) {
            if (err) {
                log.error('Could not create the quilk_modules folder in your project:');
                return log.general(err);
            }
            //copy the example module and add the example json conf to the quilk.json of this project
            fs.copy(__dirname + '/resource/example_module.js', './quilk_modules/example_module.js', function (err) {
                if (err) {
                    log.error('Could not create quilk_modules/example_module.js file:');
                    return log.general(err);
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
                        log.error('ERROR: The example module has been generated but there was an error registering the module in your quilk.json file:');
                        return console.log(err);
                    }
                    log.success('Great an example custom module has been generated for you and registered in your quilk.json file.');
                    defer.resolve();
                });
            });
        });
        return defer.promise;
    }

    if( global.cliArgs.example_module ){
        if( global.quilkConf ){
            create_exampleModule();
        } else {
            create_quilk().then( create_exampleModule );
        }
    } else {
        create_exampleModule();
    }
};