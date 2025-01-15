const bcrypt = require('bcrypt');
const User = require('../../models/UserModel');

const registerController = async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log("Registering User:", username);

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password (to save):", hashedPassword);

    // Save the user to the database
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // Confirm saved user
    const savedUser = await User.findOne({ username });
    console.log("Saved User:", savedUser);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'An error occurred during registration' });
  }
};


module.exports = registerController;
