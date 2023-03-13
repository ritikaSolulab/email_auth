const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    max: 64,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    uniquie: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isActivate: {
    type: Boolean,
    default: false
  }
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);