const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  if (
    !process.env.EMAIL_HOST ||
    process.env.EMAIL_HOST === 'smtp.mailtrap.io' &&
    !process.env.EMAIL_USER
  ) {
    console.log(`[Email Service - Simulated Send]`);
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message: ${options.message || options.html}`);
    return true;
  }

  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'CaptonAdmission <no-reply@captonadmission.com>',
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('[Email Service] Error sending email:', error.message);
    return false;
  }
};

module.exports = sendEmail;
