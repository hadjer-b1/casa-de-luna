const mongoose = require("mongoose");

const PasswordResetSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
});

module.exports = mongoose.model("PasswordReset", PasswordResetSchema);
