const nodemailer = require("nodemailer");
const {google} = require('googleapis');
const {OAuth2} = google.auth;
const OATH = 'https://developers.google.com/oauthplayground';

const {
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
    SENDER_EMAIL_ADDRESS
} = process.env

const oautho2Client = new OAuth2(
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
    OATH
)

//sendMail
const sendMail = (to, url) => {
    oautho2Client.setCredentials({
        refresh_token: MAILING_SERVICE_REFRESH_TOKEN
    });

    const accessToken = oautho2Client.getAccessToken();

    const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            type: 'OAutho2',
            user: SENDER_EMAIL_ADDRESS,
            clientId: MAILING_SERVICE_CLIENT_ID,
            clientSecret: MAILING_SERVICE_CLIENT_SECRET,
            refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
            accessToken
        }
    })
    const mailOptions = {
        from: SENDER_EMAIL_ADDRESS,
        to: to,
        subject: "Kim Luan",
        html: `
            <h1>Chuc mung ban dang ki thang cong</h1>
            <a href=${url}>Xac thuc</a>
        `
    }
    smtpTransport.sendMail(mailOptions, (err, infor) =>{
        if (err) return err;
        return infor;
    })
}

module.exports = sendMail