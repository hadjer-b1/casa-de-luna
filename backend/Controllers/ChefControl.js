const Chef = require("../Models/ChefModel");


// Get all chefs
exports.getChefs = async (req, res) => {
  try {
    const chefs = await Chef.find();
    res.json(chefs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Add a new chef
exports.addNewChef = async (req, res) => {
  try {
    const { name, Specialty, description, rating, country, imageUrl } =
      req.body;
    const newChef = new Chef({
      name,
      Specialty,
      description,
      rating: rating || 0,
      country: country || "Unknown",
      imageUrl,
    });
    const savedChef = await newChef.save();
    res.status(201).json(savedChef);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing chef
exports.updateChef = async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.id);
    if (chef) {
      const { name, Specialty, description, rating, country, imageUrl } =
        req.body;
      chef.name = name;
      chef.Specialty = Specialty;
      chef.description = description;
      chef.rating = rating || 0;
      chef.country = country || "Unknown";
      chef.imageUrl = imageUrl;
      const updatedChef = await chef.save();
      res.json(updatedChef);
    } else {
      res.status(404).json({ message: "Chef not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a chef
exports.deleteChef = async (req, res) => {
  try {
    const chefToRemove = await Chef.findById(req.params.id);
    if (chefToRemove) {
      await chefToRemove.remove();
      res.json({ message: "Chef removed successfully" });
    } else {
      res.status(404).json({ message: "Chef not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a chef by ID
exports.getChefById = async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.id);
    if (chef) {
      res.json(chef);
    } else {
      res.status(404).json({ message: "Chef not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
