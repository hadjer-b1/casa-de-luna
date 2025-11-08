const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  id: Number,
  name: String,
  Type: String,
    date: String,
    time: String,
    numberOfPeople: Number,
    specialRequests: String,
    contactInfo: {
        email: String,
        phone: String,
    },
});

module.exports = mongoose.model("Booking", BookingSchema);
