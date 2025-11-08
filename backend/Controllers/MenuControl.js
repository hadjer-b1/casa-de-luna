const Menu = require("../Models/MenuModel");


// Get all menu items
exports.getMenu = async (req, res) => {
  try {
    const menu = await Menu.find();
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new dish
exports.addNewDish = async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      price,
      imageUrl,
      quantity,
      rating,
      country,
    } = req.body;

    const newDish = new Menu({
      name,
      type,
      description,
      price,
      imageUrl,
      quantity,
      rating: rating || 0,
      country: country || "Unknown",
    });

    const savedDish = await newDish.save();
    res.status(201).json(savedDish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing dish
exports.updateDish = async (req, res) => {
  try {
    const Dish = await Menu.findById(req.params.id);
    if (Dish) {
      const { name, type, description, price, imageUrl, rating, country } =
        req.body;
      Dish.name = name;
      Dish.type = type;
      Dish.description = description;
      Dish.price = price;
      Dish.imageUrl = imageUrl;
      Dish.rating = rating || 0;
      Dish.country = country || "Unknown";
      const updatedDish = await Dish.save();
      res.json(updatedDish);
    } else {
      res.status(404).json({ message: "Dish not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete a dish
exports.deleteDish = async (req, res) => {
  try {
    const RemoveDish = await Menu.findById(req.params.id);
    if (RemoveDish) {
      await RemoveDish.remove();
      res.json({ message: "Dish removed" });
    } else {
      res.status(404).json({ message: "Dish not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get dish by name
exports.getDishByName = async (req, res) => {
  try {
    const { name } = req.params;
    const dish = await Menu.findOne({ name: name });
    if (dish) {
      res.json(dish);
    } else {
      res.status(404).json({ message: "Dish not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get dishes by type
exports.getDishByType = async (req, res) => {
  try {
    const { type } = req.params;
    const dishes = await Menu.find({ type: type });
    if (dishes.length > 0) {
      res.json(dishes);
    } else {
      res.status(404).json({ message: "No dishes found for this type" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get ordered dishes
exports.getOrderedDishes = async (req, res) => {
  try {
    const { order } = req.query;
    const dishIds = order.split(",").map((id) => id.trim().toLowerCase());
    const dishes = await Menu.find({
      name: { $in: dishIds.map((name) => new RegExp(`^${name}$`, "i")) },
    });
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update dish quantity only (for admin stock management)
exports.updateDishQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (quantity === undefined || quantity === null) {
      return res.status(400).json({ message: "Quantity is required" });
    }

    const dish = await Menu.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    dish.quantity = Number(quantity);
    const updatedDish = await dish.save();
    
    res.json({ 
      message: "Quantity updated successfully", 
      dish: updatedDish 
    });
  } catch (error) {
    console.error("Error updating dish quantity:", error);
    res.status(500).json({ message: error.message });
  }
};
