const nodemailer = require('nodemailer');
const { config } = require('../config/index');

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

    let emailSubject = '';
    let linkUrl = '';

    switch (type) {
        case this.emailType.confirmRegistration:
            emailSubject = 'Confirm registration';
            linkUrl = 'auth/confirm-registration?emailConfirmToken';
            break;

        case this.emailType.confirmNewEmail:
            emailSubject = 'Confirm new Email';
            linkUrl = 'account/confirm-new-email?emailConfirmToken';
            break;

        case this.emailType.confirmNewPassword:
            emailSubject = 'Confirm new Password';
            linkUrl = 'auth/confirm-new-password?resetPasswordToken';
            break;
    }

    const mailOptions = {
        from: 'testprojectnode31@yahoo.com',
        to: email,
        subject: emailSubject,
        html: `<b>Hello ${userName}! ${emailSubject}.</b>
            <br>Follow link: ${config.clientUrl}/${linkUrl}=${token}</br>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};
