// --- BACKEND CODE (Node.js) ---
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// App setup
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/corronilDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Mongoose Model
const Contact = mongoose.model('Contact', new mongoose.Schema({
  name: String,
  email: String,
  message: String
}));

// API Route: POST contact form data
app.post('/api/contact', async (req, res) => {
  try {
    const entry = new Contact(req.body);
    await entry.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Error saving contact:', err);
    res.status(500).json({ success: false });
  }
});

// Catch-all Route: Serve index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});



