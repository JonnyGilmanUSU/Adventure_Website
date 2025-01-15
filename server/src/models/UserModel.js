const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed passwords
  admin: { type: Boolean, default: false },  // New field for admin status
});



module.exports = mongoose.model('User', userSchema);
