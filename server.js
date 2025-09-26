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
// Validate Environment Variables
// ===============================
const requiredEnvs = ['PORT', 'MONGO_URI', 'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_RECEIVER'];
requiredEnvs.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Environment variable ${key} is missing! Please add it to your .env`);
    process.exit(1);
  }
});

// ===============================
// Initialize App
// ===============================
const app = express();
const PORT = process.env.PORT;

// ===============================
// Middleware
// ===============================
app.use(express.json());

// Restrict CORS to your domain
const allowedOrigins = [process.env.CLIENT_ORIGIN || 'https://www.corronilcontrol.com'];
app.use(cors({
  origin: allowedOrigins,
  optionsSuccessStatus: 200,
}));

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Serve robots.txt explicitly
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
});

// ===============================
// MongoDB Connection
// ===============================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });

// ===============================
// Mongoose Schema
// ===============================
const Contact = mongoose.model('Contact', new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  message: { type: String, required: true, trim: true },
}, { timestamps: true }));

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

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: '❌ All fields are required' });
  }

  try {
    await Contact.create({ name, email, message });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_RECEIVER,
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
// Serve Frontend Routes (SPA)
// ===============================
const SPA_ROUTES = ['/', '/about', '/services', '/projects', '/clients', '/contact', '/blog.html', '/faq.html'];
app.get(SPA_ROUTES, (req, res) => {
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
