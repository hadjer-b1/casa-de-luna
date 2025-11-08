const User = require("../Models/UsersModel");
const PasswordReset = require("../Models/PasswordReset");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

// This code generates a 6-digit code, used for password reset
const genCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// The function to request a password reset:
exports.requestReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const code = genCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await PasswordReset.create({ email, code, expiresAt });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Code",
      text: `
      Hello, I hope you have a lovely day!
      <p>
      This is your password reset code.
      Your reset code is ${code}. 
      It expires in 10 minutes.</p>
      <p>If you did not request a password reset, please ignore this email.</p>`,
    });

    res.json({ message: "Code sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// The verify code Function:
exports.verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const record = await PasswordReset.findOne({ email, code, used: false });

    if (!record) return res.status(400).json({ error: "Invalid code" });
    if (record.expiresAt < new Date())
      return res.status(400).json({ error: "Code expired" });

    record.used = true;
    await record.save();

    res.json({ message: "Code verified" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// The reset password Function:
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
