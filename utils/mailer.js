const nodemailer = require('nodemailer');

exports.sendConfirmToken = (email, userName, emailConfirmToken) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.mail.yahoo.com',
        port: 587,
        service: 'yahoo',
        secure: false,
        auth: {
            user: 'testprojectnode31@yahoo.com',
            pass: 'kuxuklfrptqaxkst'
        },
        debug: false,
        logger: true
    });

    const mailOptions = {
        from: 'testprojectnode31@yahoo.com',
        to: email,
        subject: 'Confirmation registration',
        html: `<b>Hello ${userName}! Confirm registration: http://localhost:3000/api/auth/confirm-email?emailConfirmToken=${emailConfirmToken}</b>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};
