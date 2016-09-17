var nodemailer   = require('nodemailer'),
    toolbox      = require('../toolbox');

module.exports = {
    run: function( next ){

        // global.current_module
        var config = global.quilkConf.email[ global.current_module.config ];

        // create reusable transporter object using the default SMTP transport
        var transporter = nodemailer.createTransport( config.transport_options );

        // prepare the message vars and add in the logs if required
        var html = global.current_module.email_message;
        if( global.current_module.include_log ){
            var ansi_to_html = require('ansi-to-html');
            var convert = new ansi_to_html();

            var logs = global.log.returnCache();

            html += '<br/>';
            for( var i=0;i<logs.length;++i ){
                html += convert.toHtml(logs[i]) + '<br/>';
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

            next();
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
