const nodemailer = require('nodemailer');

    let user = 'feliciaowo2@gmail.com';
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user,
            pass: 'bwuysftkayziwklp'
        }
    });

    module.exports = {transporter, user};
