const mongoose = require('mongoose');

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
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt & updatedAt automatically
  }
);

module.exports = mongoose.model('Contact', ContactSchema);
