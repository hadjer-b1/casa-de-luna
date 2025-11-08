require("dotenv").config();
const nodemailer = require("nodemailer");
const EMAIL = process.env.EMAIL?.trim();
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD?.trim();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  if (!to) {
    console.error("Error: No recipient defined.");
    throw new Error("No recipients defined");
  }

   
  if (!EMAIL || !EMAIL_PASSWORD) {
    console.error("[EmailService] ERROR: Email credentials not configured in .env file!");
    throw new Error("Email credentials not configured");
  }

  const mailOptions = {
    from: `"Casa De Luna" <${EMAIL}>`,
    to: to.trim(),
    subject: subject,
    html: html,
  };

  try {
     const info = await transporter.sendMail(mailOptions);
     return info;
  } catch (error) {
     console.error(`[EmailService] Full error:`, error);
    throw error;
  }
};

module.exports = sendEmail;
