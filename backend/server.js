require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

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

// API Route
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await Contact.create({ name, email, message });
    res.json({ success: true, message: '✅ Message received!' });
  } catch (err) {
    console.error('❌ Error saving message:', err);
    res.status(500).json({ success: false, message: '❌ Error saving message' });
  }
});

// Serve static frontend files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all: serve index.html for frontend routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fallback for 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});