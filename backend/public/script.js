// === BACKEND: Only run this on Node.js ===
if (typeof require !== 'undefined' && typeof module !== 'undefined') {
  const express = require('express');
  const mongoose = require('mongoose');
  const cors = require('cors');
  const path = require('path');

  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));

  mongoose.connect('mongodb://127.0.0.1:27017/corronilDB')
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB error:', err));

  const Contact = mongoose.model('Contact', new mongoose.Schema({
    name: String,
    email: String,
    message: String,
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

// === FRONTEND: Only runs in the browser ===
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const result = await response.json();
      alert(result.success ? "✅ Message sent!" : "❌ Error. Try again.");
    });
  });
}
