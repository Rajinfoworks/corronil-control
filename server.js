// ===============================
// Required Modules
// ===============================
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');

// ===============================
// Validate Environment Variables
// ===============================
const requiredEnvs = ['PORT', 'MONGO_URI', 'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_RECEIVER', 'CLIENT_ORIGIN'];
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

// Security Headers
app.use(helmet());

// Logging
app.use(morgan('combined'));

// CORS
const allowedOrigins = [process.env.CLIENT_ORIGIN];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  optionsSuccessStatus: 200,
}));

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

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
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
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
    // Save to DB
    await Contact.create({ name, email, message });

    // Send email
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_RECEIVER,
      subject: 'New Message from CORRONiL CONTROL Website',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    res.json({ success: true, message: '✅ Message saved and email sent!' });
  } catch (err) {
    console.error('❌ Error:', err.stack || err);
    res.status(500).json({ success: false, message: '❌ Something went wrong' });
  }
});

// ===============================
// Serve Sitemap and Robots.txt
// ===============================
app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});

app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
});

// ===============================
// Wildcard SPA Routes
// ===============================
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, 'public', req.path);
  if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
    return res.sendFile(filePath);
  }
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
