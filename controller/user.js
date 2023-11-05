// controllers/userController.js
const User = require("../models/user.model");

async function getUsers(req, res) {
  try {
    let users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ status: "error", error: "Failed to fetch users" });
  }
}

async function registerUser(req, res) {
  const { name, email, password } = req.body;
  try {
    const user = new User({
      name,
      email,
      password,
      created_at: new Date().toISOString(),
    });
    await user.save();
    res.json({ status: "ok" });
  } catch (error) {
    console.error("Error during registration:", error); // Log the specific error
    res.status(500).json({ status: "error", error: "Registration failed" });
  }
}
async function getUserById(req, res) {
  try {
    const id = req.params.id; // Retrieve the id parameter from the URL
    const user = await User.findById(id); // Fetch the user by ID
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ status: "error", error: "Failed to fetch user" });
  }
}


module.exports = {
  getUsers,
  registerUser,
  getUserById,
};
