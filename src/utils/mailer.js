const nodemailer = require('nodemailer');

exports.emailType = {
    confirmRegistration: 'registration',
    confirmNewEmail: 'newEmail',
    confirmNewPassword: 'newPassword'
};

exports.sendConfirmToken = (email, userName, token, type) => {
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

    let emailSubject;

    switch (type) {
        case this.emailType.confirmRegistration:
            emailSubject = 'Confirm registration';
            break;

        case this.emailType.confirmNewEmail:
            emailSubject = 'Confirm new Email';
            break;

        case this.emailType.confirmNewPassword:
            emailSubject = 'Confirm new Password';
            break;
    }

    const mailOptions = {
        from: 'testprojectnode31@yahoo.com',
        to: email,
        subject: emailSubject,
        html: `<b>Hello ${userName}! ${emailSubject}. Your token: ${token}</b>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};
