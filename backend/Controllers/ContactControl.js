const sendEmail = require("../services/emailService");

exports.sendContact = async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing name, email or message" });
    }

    const adminTo = process.env.EMAIL;
    const subject = `Contact form submission from ${name}`;
    const html = `
      <h3>New contact submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br/>")}</p>
    `;

    await sendEmail({ to: adminTo, subject, html });

    try {
      const ackSubject = `Thank you for contacting us, ${name}`;
      const ackHtml = `<p>Dear ${name},</p><p>Thank you for your message — we will respond shortly.</p>`;
      await sendEmail({ to: email, subject: ackSubject, html: ackHtml });
    } catch (ackErr) {
      console.error("Failed to send ack email:", ackErr.message || ackErr);
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("Contact send error:", err.message || err);
    return res.status(500).json({ error: "Failed to send contact message" });
  }
};
