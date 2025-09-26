// models/contact.js
const mongoose = require('mongoose');

// ===============================
// Contact Schema
// ===============================
const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
  }
);

// ===============================
// Export Contact Model
// ===============================
module.exports = mongoose.model('Contact', ContactSchema);
