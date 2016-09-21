var nodemailer   = require('nodemailer'),
    ansiHTML     = require('ansi-html'),
    toolbox      = require('../toolbox'),
    _            = require("lodash");
//inject the lodash-deep
_.mixin(require("lodash-deep"));

module.exports = {
    run: function( next ){

        var i, error = false;

        // global.current_module
        var config = global.quilkConf.email[ global.current_module.config ];
        if( config.transport_options.environment_variables ){
            delete config.transport_options.environment_variables;
            _.deepMapValues(config.transport_options, function(value, path){
                if( !process.env[ value ] ){
                    global.log.error( 'ERROR: email module could not find an environment variable' );
                    global.log.general( value );
                    error = true;
                } else {
                    _.update(config.transport_options, path, function(n) {
                        //set the env var into this place
                        return process.env[ value ];
                    });
                }
            });
        }

        if( error ){
            global.die();
        }

        // create reusable transporter object using the default SMTP transport
        var transporter = nodemailer.createTransport( config.transport_options );

        // prepare the message vars and add in the logs if required
        var html = global.current_module.email_message;
        if( global.current_module.include_log ){
            var logs = global.log.returnCache();

            html += '<br/>';
            for( i=0;i<logs.length;++i ){
                html += ansiHTML(logs[i]) + '<br/>';
            }
        }

        //convert html breaks then strip out the remaining html tags
        var text = toolbox.striptags( toolbox.br2nl( html ) );

        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: '"'+config.email_from.name+'" <'+config.email_from.email+'>', // sender address
            to: ( typeof config.email_to == 'string' ) ? config.email_to : config.email_to.join(', '),
            subject: global.current_module.email_subject, // Subject line
            text: text, // plaintext body
            html: html // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return global.log.error(error);
            }
            global.log.general('Message sent: ' + info.response);

            if(next) {
                next();
            }
        });

    },
    help: function(){
        var helps = [
            'This module does what you might expect, it sends out an email.',
            'It is available as a quilk module should you want it, however it can also be used to alert you when a build fails, or succeeds.'
        ];
        var clc = require('cli-color');
        console.log( clc.bold.underline('css_fixed module help - start') );
        for( var key in helps ){
            console.log( helps[key] );
        }
        console.log( clc.bold.underline('css_fixed module help - end') );
    }
};
