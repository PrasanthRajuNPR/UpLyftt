const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY); // or SENDGRID_API_KEY

const mailSender = async (email, title, body) => {
  try {
    console.log("Attempting to send email to:", email);

    const msg = {
      to: email,
      from: "uplyft01@gmail.com", // MUST be verified in SendGrid
      subject: title,
      html: body,
    };

    const result = await sgMail.send(msg);

    console.log("SendGrid email sent:", result[0].statusCode);
    return result;
  } catch (err) {
    console.error("SendGrid error:", err.response?.body || err.message);
    throw err;
  }
};

module.exports = mailSender;
