// ===============================
// Required Modules
// ===============================
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');

// ===============================
// Initialize App
// ===============================
const app = express();
const PORT = process.env.PORT || 5000;

// ===============================
// Middleware
// ===============================
app.use(cors());
app.use(express.json());

// Serve frontend from backend/public
app.use(express.static(path.join(__dirname, 'public')));

// ===============================
// MongoDB Connection
// ===============================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection failed:', err));

// ===============================
// Mongoose Schema
// ===============================
const Contact = mongoose.model('Contact', new mongoose.Schema({
  name: String,
  email: String,
  message: String,
}));

// ===============================
// Nodemailer Transporter
// ===============================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ===============================
// Contact Route
// ===============================
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Save to DB
    await Contact.create({ name, email, message });

    // Send email
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_RECEIVER || 'c.control2005@gmail.com',
      subject: 'New Message from CORRONiL CONTROL Website',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: '✅ Message saved and email sent!' });
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ success: false, message: '❌ Something went wrong' });
  }
});

// ===============================
// Serve Frontend Routes
// ===============================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===============================
// 404 Fallback
// ===============================
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// ===============================
// Start Server
// ===============================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
