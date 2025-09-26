const express = require("express");
const router = express.Router();
const Contact = require("../models/contact");
const nodemailer = require("nodemailer");

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Save to MongoDB
    const newMessage = new Contact({ name, email, message });
    await newMessage.save();
    console.log("💾 Message saved to MongoDB:", newMessage);

    // Send email
    const mailOptions = {
      from: `"Ganesh Engineers Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `📩 New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("📧 Email sent successfully");
    } catch (err) {
      console.error("❌ Email sending error:", err.message);
    }

    res.status(200).json({
      success: true,
      message: "✅ Message received. Thank you for contacting us!",
    });
  } catch (err) {
    console.error("❌ Server error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
