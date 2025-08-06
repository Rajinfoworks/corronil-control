// Required modules
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer'); // <-- Email

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'backend/public')));

// MongoDB connection
mongoose.connect('mongodb+srv://rajinfoworks:Raj.infoworks16@cluster0.vcjlnsv.mongodb.net/corronilcontrol?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err));

// Mongoose Schema
const Contact = mongoose.model('Contact', new mongoose.Schema({
  name: String,
  email: String,
  message: String,
}));

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,   // from .env
    pass: process.env.EMAIL_PASS    // app password from .env
  }
});

// 📩 Contact route
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Save to DB
    await Contact.create({ name, email, message });

    // Send email
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: "c.control2005@gmail.com", // your email to receive
      subject: "New Message from CORRONiL CONTROL Website",
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: '✅ Message saved and email sent!' });
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ success: false, message: '❌ Something went wrong' });
  }
});

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 fallback
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
