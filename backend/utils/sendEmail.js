import { createTransport } from 'nodemailer';

/**
 * Send email utility
 * @param {Object} options - Email options
 * @returns {Promise} - Promise with info about the sent email
 */
const sendEmail = async (options) => {
  // Create reusable transporter object using the default SMTP transport
  const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Define email options
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // Send email
  const info = await transporter.sendMail(mailOptions);

  return info;
};

export default sendEmail;