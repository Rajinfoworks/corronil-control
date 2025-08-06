// contact.js
const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

// Email transporter config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Single route to handle form submission
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  try {
    // Save to MongoDB
    const newMessage = new Contact({ name, email, message });
    await newMessage.save();

    // Send email
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: "c.control2005@gmail.com",
      subject: "New Message from CORRONiL CONTROL Website",
      text: `
        You have received a new message:
        
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Message saved and email sent!" });
  } catch (error) {
    console.error("Error in contact form:", error);
    res.status(500).json({ success: false, message: "Server error. Try again later." });
  }
});

module.exports = router;

