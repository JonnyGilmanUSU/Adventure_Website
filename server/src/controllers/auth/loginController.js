const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/UserModel');

const loginController = async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log("Login Attempt - Username:", username);

    // Find the user in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    console.log("User Found:", user);

    // Compare passwords
    console.log("Input Password (Plain Text):", password);
    console.log("Stored Password (Hashed):", user.password);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password Validity:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    console.log("Admin?:  ", user.admin);

    // Generate a JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, admin: user.admin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send the token and admin status back to the client
    res.status(200).json({
      message: 'Login successful',
      token,
      admin: user.admin, // Explicitly include the admin field
      username: user.username, // Include the username field
    });
    
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'An error occurred during login' });
  }
};

module.exports = loginController;
