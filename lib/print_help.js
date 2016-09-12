var clc    = require('cli-color');

module.exports = function(){

    if( global.cliArgs.module ){
        var file = './modules/' + global.cliArgs.module;
        try{
            require( file ).help();
        } catch( e ){
            //try load from the custom project module
            file =  pwd + '/quilk_modules/' + global.cliArgs.module;
            try{
                require( file ).help();
            } catch ( e2 ) {
                console.log(clc.bold.red('ERROR finding module'));
                logTime( e );
                return logTime( e2 );
            }
        }
        return;
    }

    function header( msg ){
        console.log( ' ' );
        console.log( clc.bold('>>> ') + clc.bold.underline(msg)  + clc.bold(' <<<') );
    }
    function header_end( msg ){
        var spacer_line = '';
        for( var i = 0 ; i < 25 ; ++i ){
            spacer_line += '_';
        }
        console.log( clc.bold.underline(spacer_line)  );
    }

    var available_commands = {
        d: {
            msg: 'A shortcut to the developer keyword',
            eg: 'quilk d=john'
        },
        developer: {
            msg: 'A valid developer found in the quilk.json file',
            eg: 'quilk developer=john'
        },
        help :{
            msg: 'Prints the help for quilk',
            eg: 'quilk help'
        },
        init: {
            msg: 'Pass the argument init and quilk will generate a template quilk file for you, run this from the root of your project',
            eg: 'quilk init'
        },
        'init example_module': {
            msg: 'Pass this additional argument to the init command to produce an example custom module and inject into the modules array',
            eg: 'quilk init example_module'
        },
        quiet: {
            msg: 'Silences some of the notification bubbles. NB the notifications will only work if you choose the correct type in your developer block in the quilk.json.',
            eg: 'quilk d=john quiet'
        },
        release: {
            msg: 'In the quilk.json you may configure a series of different release commands, each will be run one ofter the other. Once finished the js and css will be compiled.',
            eg: 'quilk release=live'
        },
        sync_only: {
            msg: 'Will only sync the entire file set using the rsync module, all ignores will not be used',
            eg: 'quilk d=john sync_only'
        },
        v:{
            msg: 'A shortcut to version',
            eg: 'quilk v'
        },
        version:{
            msg: 'Prints the current version of quilk you are running',
            eg: 'quilk version'
        },
        watch: {
            msg: 'This will instruct chokidar to watch your fileset for changes, it will ignore paths or exact files you places in the "dont_watch" bit of the quilk.json',
            eg: 'quilk d=john watch'
        }
    };

    header('Available command line arguments');
    for( var key in available_commands ){
        console.log( clc.bold( key ) );
        console.log( 'Description: ' + available_commands[key].msg );
        console.log( 'Example: ' + available_commands[key].eg );
        console.log( ' ' );
    }

    var default_modules = {
        browserify:   {
            module_example: {
                "name": "Browserify files",
                "module" : "browserify_bundle",
                "browserify_main": "/public/browserify_modules/browserifyMain.js",
                "browserify_bundle_name": "bfyModules",
                "target" : "/public/js/bundle.js"
            }
        },
        js_find:   {
            module_example: {
                "name": "App Files",
                "module": "js_find",
                "include_first": [
                    "/public/js_to_compile/globalOverrideFunctions.js",
                    "/public/js_to_compile/app.js",
                    "/public/js_to_compile/app.config.js"
                ],
                "find_in_paths": [
                    "/public/js_to_compile/"
                ],
                "target" : "/public/js/build.js"
            }
        },
        js_fixed:   {
            module_example: {
                "name" : "Vendor Files",
                "module": "js_fixed",
                "files": [
                    "/public/bower_components/jquery/dist/jquery.js",
                    "/public/bower_components/bootstrap/dist/js/bootstrap.min.js",
                    "/public/bower_components/angular/angular.min.js",
                    "/public/bower_components/angular-route/angular-route.min.js",
                    "/public/bower_components/angular-sanitize/angular-sanitize.min.js",
                    "/public/bower_components/angular-bootstrap/ui-bootstrap.min.js",
                    "/public/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
                    "/public/bower_components/ngDialog/js/ngDialog.min.js"
                ],
                "target": "/public/js/vendor.js"
            }
        },
        css_fixed:   {
            module_example: {
                "name" : "Vendor CSS Files",
                "module": "css_fixed",
                "files": [
                    "/public/bower_components/bootstrap/dist/css/bootstrap.css",
                    "/public/bower_components/ngDialog/css/ngDialog.css",
                    "/public/bower_components/ngDialog/css/ngDialog-theme-plain.css"
                ],
                "target": "/public/css/vendor.css"
            }
        },
        less_std:   {
            module_example: {
                "name"   : "Less compiler",
                "module" : "less_std",
                "resourcePaths" : ["/resources/assets/less/"],
                "input_path"  : "/resources/assets/less/xenon.less",
                "target" : "/public/css/app.css"
            }
        },
        sass_std:   {
            module_example: {
                "name": "App CSS",
                "module": "sass_std",
                "outputStyle": "expanded",
                "sourceComments": true,
                "input_path": "/resources/assets/sass/app.scss",
                "target": "/public/css/all.css"
            }
        },
        sass_find:   {
            module_example: {
                "name": "App CSS (SASS find)",
                "module": "sass_find",
                "outputStyle": "expanded",
                "sourceComments": true,
                "include_first": [
                    "/public/app/core/scss/global.scss"
                ],
                "ignorePaths" : [
                    "core/scss"
                ],
                "find_in_path": "/public/app/",
                "target": "/public/css/index.css"
            }
        },
        rsync:   {
            module_example: {
                "name": "Rsync it",
                "module": "rsync",
                "ignore": {
                    "windows" : [],
                    "mac"     : [],
                    "global"  : [
                        ".git*",
                        ".idea*",
                        "storage",
                        "node_modules/*",
                        "tests/*",
                        "vendor/*"
                    ]
                }
            }
        }
    };

    header( 'Available modules for the quilk.json' );
    for( var key in default_modules ){
        console.log( clc.bold( key ) );
        console.log( default_modules[key].module_example );
        console.log( ' ' );
    }
    console.log( clc.bold( 'For module specific help just run: ' ) + 'quilk help module=<module_name>' );

    var developer_options = {
        notify:   {
            styles: "WindowsBalloon || WindowsToaster || Growl || NotifySend"
        },
        platform:   [
            'windows', 'mac', 'linux'
        ],
        rsync:   'Please see the readme for what to place in a developer block for rsync. Should an rsync section not be found in the developer block the rsync module will not run'
    };
    header( 'Available options for the developer blocks in quilk.json' );
    for( var key in developer_options ){
        console.log( clc.bold( key ) );
        console.log( developer_options[key] );
        console.log( ' ' );
    }
};
