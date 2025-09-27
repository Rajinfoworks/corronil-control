// ===============================
// Required Modules
// ===============================
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const nodemailer = require("nodemailer");

// ===============================
// Validate Environment Variables
// ===============================
const requiredEnvs = ["PORT", "MONGO_URI", "EMAIL_USER", "EMAIL_PASS", "EMAIL_RECEIVER"];
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
const PORT = process.env.PORT || 5000;

// ===============================
// Middleware
// ===============================
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || "https://www.corronilcontrol.com",
  "http://localhost:5000", // for local dev
  "http://127.0.0.1:5000",
];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// MongoDB Connection
// ===============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ===============================
// Mongoose Schema
// ===============================
const Contact = mongoose.model(
  "Contact",
  new mongoose.Schema(
    {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      message: { type: String, required: true, trim: true },
    },
    { timestamps: true }
  )
);

// ===============================
// Nodemailer Transporter (SendGrid)
// ===============================
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false, // true for 465
  auth: {
    user: "apikey", // literal string "apikey"
    pass: process.env.SENDGRID_API_KEY,
  },
});

// Optional: verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter error:", error.message);
  } else {
    console.log("📧 Email transporter ready (SendGrid)");
  }
});


// ===============================
// Contact Route
// ===============================
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "❌ All fields are required" });
  }

  try {
    // Save in DB
    await Contact.create({ name, email, message });

    // Send mail
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_RECEIVER,
      subject: "New Message from CORRONiL CONTROL Website",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ success: true, message: "✅ Message saved and email sent!" });
  } catch (err) {
    console.error("❌ Error in /api/contact:", err.message);
    res.status(500).json({ success: false, message: "❌ Something went wrong, please try again later." });
  }
});

// ===============================
// Static Files + SPA Routes
// ===============================
app.use(express.static(path.join(__dirname, "public")));

const SPA_ROUTES = ["/", "/about", "/services", "/projects", "/clients", "/contact", "/blog.html", "/faq.html"];
app.get(SPA_ROUTES, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Robots.txt explicitly
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.sendFile(path.join(__dirname, "public", "robots.txt"));
});

// 404 Fallback
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

// ===============================
// Start Server
// ===============================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
