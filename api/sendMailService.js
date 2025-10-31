import 'dotenv/config';
import nodemailer from 'nodemailer';


export async function sendMail({emailTo, subject, body}) {
    if (process.env.DISABLE_EMAIL === 'true') {
        console.log('Email sending disabled. Would have sent');
        console.log({emailTo, subject, body});
        return;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: emailTo,
        subject: subject,
        text: body
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email via SMTP:', error);
        throw new Error(`Failed to send email via SMTP: ${error.message}`);
    }
}
