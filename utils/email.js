import nodemailer from 'nodemailer';

export default async function sendEmail(options) {
  console.log('oyayayayyayyayayyayayayyayayayayayayaya');
  // 1, create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2, define the email options
  const mailOptions = {
    from: 'Yeabsira Shimelis shimelisyeabsira1@gmail.com',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3, send the email
  await transporter.sendMail(mailOptions);
}
