script, js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/corronilDB')
    .then(() => console.log('✅ MongoDB Connected'))
    .catch((err) => console.error('❌ MongoDB Error:', err));

// Mongoose schema and model
const Contact = mongoose.model('Contact', new mongoose.Schema({
    name: String,
    email: String,
    message: String
}));

// Contact API
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const entry = new Contact({ name, email, message });
        await entry.save();
        res.status(200).json({ success: true, message: 'Form submitted!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error saving data' });
    }
});

// This must be the last route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});





document.getElementById("contact-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    const response = await fetch("https://your-backend-url.onrender.com/api/contact", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
    });

    const result = await response.json();

    if (result.success) {
        alert("Message sent successfully!");
    } else {
        alert("Error sending message. Try again.");
    }
});