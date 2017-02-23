var node_notifier_module = require('node-notifier'),
    node_notifier_popup = false,
    node_notifier_platform = false,
    _ = require('lodash'),
    q = require('q');

/**
 * Sets the style for the notifier on initialization and caches for subsequent use.
 * @returns {*}
 */
function setStyle (){
    var deferred = q.defer();
    if( !node_notifier_popup ){
        switch( global.quilkConf.developers[global.cliArgs.developer].notifier.style || '' ){
            case 'WindowsBalloon': {
                node_notifier_popup = node_notifier_module.WindowsBalloon;
                node_notifier_platform = new node_notifier_popup({
                    withFallback: false, // Try Windows Toast and Growl first?
                    customPath: void 0 // Relative path if you want to use your fork of notifu
                });
                deferred.resolve( );
            } break;
            case 'WindowsToaster': {
                node_notifier_popup = node_notifier_module.WindowsToaster;
                node_notifier_platform = new node_notifier_popup({
                    withFallback: false, // Fallback to Growl or Balloons?
                    customPath: void 0 // Relative path if you want to use your fork of toast.exe
                });
                deferred.resolve( );
            } break;
            case 'Growl':{
                node_notifier_popup = node_notifier_module.Growl;
                node_notifier_platform = new node_notifier_popup({
                    name: 'Growl Name Used', // Defaults as 'Node'
                    host: 'localhost',
                    port: 23053
                });
                deferred.resolve( );
            } break;
            case 'NotifySend':{
                node_notifier_popup = node_notifier_module.NotifySend;
                node_notifier_platform = new node_notifier_popup();
                deferred.resolve( );
            } break;
            default: {
                deferred.reject( );
            } break;
        }
    } else {
        deferred.resolve( );
    }
    return deferred.promise;
}

module.exports = function ( title, message, level ){
    level = level || false;
    var userL = global.quilkConf.developers[global.cliArgs.developer].notifier.on_for_level;
    if( typeof userL !== 'number'){
        userL = 11; //set the level higher than the top to bypass
    }
    if(global.quilkConf.developers[global.cliArgs.developer].notifier.on || userL <= level ){
        setStyle().then( function(){
            node_notifier_platform.notify( _.merge({title: title, message: message}, global.quilkConf.developers[global.cliArgs.developer].notifier) );
        }, function(){
            global.logTime( 'ERROR: Could not show desktop notification as no valid style set in the quilk.json for the current developer.','bold' );
        } );
    }
};