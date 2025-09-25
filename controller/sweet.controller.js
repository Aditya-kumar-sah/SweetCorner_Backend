// const { default: Login } = require("../../frontend/src/pages/Login");
const Sweet = require("../model/sweet.model");

// Add a new sweet
const addSweet = async (req, res) => {
  try {
    const { name, price, category, quantity } = req.body;

    let sweetpic;

    if((req.file)){
        const localPath = req.file.filename;
        // console.log(process.env.BACKEND_URL);
        
        sweetpic = `${process.env.BACKEND_URL}/uploads/${localPath}`; 
    }
    
    const existingSweet = await Sweet.findOne({ name });
    if (existingSweet) {
      return res.status(400).json({ message: "Sweet with this name already exists" });
    }

    let sweet;
    if(req.file) sweet = new Sweet({ name, price, category, quantity,sweetpic });
    else sweet = new Sweet({ name, price, category, quantity })
    await sweet.save();
    res.status(200).json({ message: "Sweet added successfully", sweet });
  } catch (error) {
    res.status(500).json({ message: "Error adding sweet", error: error.message });
  }
};

// Get all sweets
const getSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.status(200).json(sweets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sweets", error: error.message });
  }
};

// Search sweets (by name, category, or price range)
const searchSweets = async (req, res) => {
  try {
    const { category, name, pricemin, pricemax } = req.body;

    let filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" }; // case-insensitive
    }
    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }
    if (pricemin || pricemax ) {
      filter.price = {};
      if (pricemin) filter.price.$gte = Number(pricemin);
      if (pricemax) filter.price.$lte = Number(pricemax);
    }

    const sweets = await Sweet.find(filter);
    res.status(200).json(sweets);
  } catch (error) {
    res.status(500).json({ message: "Error searching sweets", error: error.message });
  }
};

// Update sweet details
const updateSweet = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    let sweetpic;

    if((req.file)){
        const localPath = req.file.filename;
        // console.log(process.env.BACKEND_URL);
        
        sweetpic = `${process.env.BACKEND_URL}/uploads/${localPath}`; 
        updates.sweetpic = sweetpic;
    }

    const sweet = await Sweet.findByIdAndUpdate(id, updates, { new: true });
    if (!sweet) {
      return res.status(400).json({ message: "Sweet not found" });
    }

    res.status(200).json({ message: "Sweet updated successfully", sweet });
  } catch (error) {
    res.status(500).json({ message: "Error updating sweet", error: error.message });
  }
};

// Delete a sweet
const deleteSweet = async (req, res) => {
  try {
    const { id } = req.params;
    const sweet = await Sweet.findByIdAndDelete(id);

    if (!sweet) {
      return res.status(400).json({ message: "Sweet not found" });
    }

    res.status(200).json({ message: "Sweet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting sweet", error: error.message });
  }
};

// Purchase a sweet (decrease quantity if available)
const purchaseSweet = async (req, res) => {
  try {
    const { id } = req.params;
    const sweet = await Sweet.findById(id);

    if (!sweet) {
      return res.status(400).json({ message: "Sweet not found" });
    }

    if (sweet.quantity <= 0) {
      return res.status(400).json({ message: "Sweet is out of stock" });
    }

    sweet.quantity -= 1;
    await sweet.save();

    res.status(200).json({ message: "Sweet purchased successfully", sweet });
  } catch (error) {
    res.status(500).json({ message: "Error purchasing sweet", error: error.message });
  }
};

// Restock a sweet (increase quantity)
const restockSweet = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const sweet = await Sweet.findById(id);
    if (!sweet) {
      return res.status(400).json({ message: "Sweet not found" });
    }

    sweet.quantity += quantity;
    await sweet.save();

    res.status(200).json({ message: "Sweet restocked successfully", sweet });
  } catch (error) {
    res.status(500).json({ message: "Error restocking sweet", error: error.message });
  }
};

module.exports = {
  addSweet,
  getSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
};
