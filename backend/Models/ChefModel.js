const mongoose = require("mongoose");

const ChefSchema = new mongoose.Schema({
  id: Number,
  name: String,
  Specialty: String,
  description: String,
  rating: Number,
  country: String,
  imageUrl: String,
  TopChoiceDish: {
    menuItemId: Number,
    name: String,
    imageUrl: String,
  },
});

module.exports = mongoose.model("Chef", ChefSchema);
