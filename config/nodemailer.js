/*
 *  Nodemailer Configuration
 */
var nodemailer = require('nodemailer'),
    config = require('config').Email;

module.exports = (function() {
    //Configure nodemailer with gmail account
    var transport = nodemailer.createTransport("Gmail",{
        auth: {
            user: config.user,
            pass: config.password
        }
    });

    //setup e-mail data with unicode symbols
    var confirmMailOptions = {
        from: "Oplah " + config.user, // sender address
        subject: "New email from Oplah"
    }

    //Return function to send emails
    return {
        sendEmail: function(receiver, subject, text, html) {
            //Complete email options
            confirmMailOptions.to = receiver;
            confirmMailOptions.subject = subject;
            confirmMailOptions.text = text;
            confirmMailOptions.html = html;

            //Send mail with defined transport object
            transport.sendMail(confirmMailOptions, function(err, response){
                if(err){
                    console.log(error);
                }else{
                    console.log("Message sent: " + response.message);
                }
                transport.close(); // shut down the connection pool, no more messages
            });
        }
    };
}());