var request  = require('request'),
    jsonfile = require('jsonfile'),
    log      = require('./log');

module.exports = function( next ){
    request('https://raw.githubusercontent.com/jdcrecur/quilk/master/package.json', function (error, response, body) {
            if( typeof response !== 'undefined' ){
                if( typeof response.statusCode !== 'undefined' ){
                    if( response.statusCode === 200 ) {
                        body = JSON.parse(body);
                        jsonfile.readFile( __dirname + '/../package.json', function (err, obj) {
                            var newv = Number(body.version.split('.').join(''));
                            var currentv = Number(obj.version.split('.').join(''));
                            if( newv > currentv ){
                                log.error('Your quilk version is out of date.');
                                log.error('Your local version is: ' + obj.version);
                                log.error('The new version is: ' + body.version);
                                desktopNotify( 'quilk out of date!', '...', 10);
                            }
                        });
                    }
                }
            }
    });
};