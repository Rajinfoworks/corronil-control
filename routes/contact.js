const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = new Contact({ name, email, message });
    await newMessage.save();
    res.status(200).json({ success: true, message: 'Message saved!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;


const nodemailer = require("nodemailer");

// Replace with your Gmail or SMTP credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,      // your email
    pass: process.env.EMAIL_PASS     // NOT your Gmail password
  }
});

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: "c.control2005@gmail.com", // where you want to receive the message
    subject: "New Message from CORRONiL CONTROL Website",
    text: `
      You have received a new message:
      
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to send message." });
  }
});
