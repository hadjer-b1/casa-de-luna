const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema(
  {
    id: Number,
    fullname: String,
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "worker", "admin"],
      default: "user",
    },
    phone: String,
    address: String,
    orderItems: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
        },
        quantity: {
          type: Number,
          required: true,
        },
        paymentStatus: {
          type: String,
          enum: ["pending", "paid"],
          default: "pending",
        },
      },
    ],
    paymentMethods: {
      type: String,
      enum: ["credit", "debit", "paypal", "cash"],
      cardDetails: {
        number: String,
        expiry: String,
        cvv: String,
      },
      default: "credit",
    },
    vipMembership: {
      active: { type: Boolean, default: false },
      tier: {
        type: String,
        enum: ["silver", "gold", "platinum"],
        default: "gold",
      },
      since: Date,
      paymentPreference: {
        type: String,
        enum: ["card", "paypal", "cash"],
        default: "card",
      },
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
      },
    ],
    notifications: [
      {
        message: String,
        type: { type: String, default: "info" },
        read: { type: Boolean, default: false },
        meta: Object,
        date: { type: Date, default: Date.now },
      },
    ],
    history: [
      {
        type: {
          type: String,
          enum: ["order", "reservation", "other"],
        },
        details: Object,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  {
    versionKey: false, // Disable versioning to prevent version conflict errors
  }
);

module.exports = mongoose.model("Users", UsersSchema);
