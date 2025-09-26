// routes/contact.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

// ===============================
// Contact Mongoose Model
// ===============================
const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", ContactSchema);

// ===============================
// Nodemailer Transporter
// ===============================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


// ===============================
// POST /api/contact
// ===============================
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  // Validate request
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  try {
    // Save message to MongoDB
    const newMessage = await Contact.create({ name, email, message });

    // Send email notification
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_RECEIVER,
      subject: "New Message from CORRONiL CONTROL Website",
      text: `You have received a new message:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: "Message saved and email sent!" });
  } catch (err) {
    console.error("❌ Contact form error:", err);
    return res.status(500).json({ success: false, message: "Server error. Try again later." });
  }
});

module.exports = router;
