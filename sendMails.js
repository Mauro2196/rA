const nodemailer = require('nodemailer');

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'z.qa.roku@gmail.com',
            pass: 'qaroku1234'
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'z.qa.roku@gmail.com', // sender address
        to: 'mauricio.rodriguez@zemoga.com', // list of receivers
        subject: `QA Automation Report Roku - Reelz Sprint 1 ${new Date()} ✔`, // Subject line
        html:   '<p>Good Afternoon Team,'+
                `</p><p>Find general report for the QA Automation for Roku for the Reelz Channel, this test was run on <span style="color:red;">${new Date()}</span></p>`+
                '<p>QA team will be working on the following tasks:</p>'+
                '<p style="color:red;"><b><br>Complete all Test cases for this Sprint</p></b>'+
                '<p><br>Let me know if you have any question.<p>'+
                '</p><br>Regards,</p>', // plain text body', // html body
        attachments: [
            // String attachment
            {
                filename: 'test-report.html',
                content: 'Some notes about this e-mail',
                path: '/Users/mauriciorodriguez/Documents/sockets/nodejs-client/test-report.html'
            },]
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
});