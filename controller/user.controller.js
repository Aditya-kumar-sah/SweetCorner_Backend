const bcrypt = require("bcrypt");
const User = require("../model/user.model");
const jwt = require("jsonwebtoken")

// Create User
const createUser = async (req, res) => {
  const { name, email, contact, address, password } = req.body;

  try {
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

    const newUser = await User.create({
      name,
      email,
      contact,
      address,
      password: hashedPassword,
    });

    return res.status(200).json({ message: "Registered successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Registration failed!", error: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User not found!" });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    //creating token

     const token = jwt.sign(
      { id: existingUser._id, isAdmin: existingUser.isAdmin,email:existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // token expiry
    );

    return res.cookie("uid",token).status(200).json({ message: "Login successful!" ,token});
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Login failed!", error: error.message });
  }
};

module.exports = { createUser, loginUser };
