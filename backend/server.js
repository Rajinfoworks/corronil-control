// --- BACKEND CODE (Node.js) ---
if (typeof require !== 'undefined' && typeof module !== 'undefined') {
  const express = require('express');
  const mongoose = require('mongoose');
  const cors = require('cors');
  const path = require('path');

  const app = express();
  const PORT = process.env.PORT || 5000;

  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));

  // MongoDB connection
  mongoose.connect('mongodb://127.0.0.1:27017/corronilDB')
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Error:', err));

  const Contact = mongoose.model('Contact', new mongoose.Schema({
    name: String,
    email: String,
    message: String
  }));

  app.post('/api/contact', async (req, res) => {
    try {
      const entry = new Contact(req.body);
      await entry.save();
      res.status(200).json({ success: true });
    } catch {
      res.status(500).json({ success: false });
    }
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}


