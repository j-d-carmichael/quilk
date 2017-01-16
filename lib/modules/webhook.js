var request      = require('request'),
    toolbox      = require('../toolbox');

var self = {

    run: function( next ){

        //the request options
        var options = {
            method: 'post',
            json: self.buildPostObject(),
            url: global.current_module.url
        };

        global.log.general( 'Webhook starting: ' + global.current_module.url );

        var request_cb = function(err, response, body){
            if( err ){
                global.log.error( 'Webhook failed' );
                global.log.general( err );
                return next();
            } else {
                global.log.general( 'Webhook completed with the following repsonse body: ' );
                global.log.general( body );
                if( next ){
                    next();
                }
            }
        };

        if( global.current_module.auth_username ){
            request(options, request_cb ).auth( global.current_module.auth_username, global.current_module.auth_password , false);
        } else {
            request(options, request_cb );
        }
    },

    /**
     * Reads the module data to build the request object and return.
     * @returns {{}}
     */
    buildPostObject: function(  ){
        var p = {};

        if( global.current_module.message_start ){
            p.text = global.current_module.message_start + "\n\n";
        } else {
            p.text = "*Quilk logs:*\n\n"
        }

        if( global.current_module.include_logs ){
            var logs = global.log.returnCache();
            for( var i=0 ; i<logs.length ; ++i ){
                try{
                    p.text += toolbox.striptags( convert.toHtml( logs[i] ) ) + "\n";
                } catch ( e ) {
                    p.text += toolbox.striptags( logs[i] ) + "\n";
                }
            }
        }

        return p;
    },

    /**
     * Help output for this module when quilk help module=webhook
     */
    help: function(){
        var h = [
            'The webhook module is fairly simple.. pass it a url and it will call it via post.',
            'For basic authentication add username and password to the module object eg:',
            {
                "name" : "Pinging slack",
                "module" : "webhook_get",
                "url" : "https://hooks.slack.com/services/test/drgfn/gfdbfbg",
                "auth_username" : "username",
                "auth_password" : "password"
            }
        ];
        var clc = require('cli-color');
        console.log( clc.bold.underline('webhook module help - start') );
        for( var key in helps ){
            console.log( helps[key] );
        }
        console.log( clc.bold.underline('webhook module help - end') );
    }
};

module.exports = self;