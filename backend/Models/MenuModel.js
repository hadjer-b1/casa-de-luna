const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
  id: Number,
  name: String,
  type: String,
  description: String,
  price: Number,
  rating: Number,
  quantity: Number,
  country: String,
  imageUrl: String,
});

module.exports = mongoose.model("Menu", MenuSchema);
