const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587, // Use 587 for STARTTLS
      secure: false, // Must be false for port 587
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      // ADD THIS: Increase timeout settings for slow server connections
      connectionTimeout: 20000, // 10 seconds
      greetingTimeout: 10000,
    });

    let info = await transporter.sendMail({
      from: `"UpLyft" <${process.env.MAIL_USER}>`,
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });

    return info;
  } catch (error) {
    console.log("Nodemailer Error: ", error.message);
    throw error; // Re-throw so the controller catches it
  }
};

module.exports = mailSender;