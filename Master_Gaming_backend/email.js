const nodemailer = require('nodemailer');

let transporter;

function getTransporter() {
    if (transporter) return transporter;

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
        throw new Error('Email service is not configured');
    }

    transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: SMTP_USER, pass: SMTP_PASSWORD }
    });
    return transporter;
}

async function sendVerificationCode(email, code, purpose) {
    const isRegistration = purpose === 'registration';
    await getTransporter().sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: isRegistration ? 'Verify your Master Gaming account' : 'Reset your Master Gaming password',
        text: `Your Master Gaming verification code is ${code}. This code expires in 10 minutes.`
    });
}

module.exports = { sendVerificationCode };