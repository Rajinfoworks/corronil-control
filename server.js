// ===============================
// Required Modules
// ===============================
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { sendMail } from "./mailer.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===============================
// Validate Environment Variables
// ===============================
const requiredEnvs = ["PORT", "MONGO_URI", "SENDGRID_API_KEY", "EMAIL_RECEIVER"];
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
  "http://localhost:5000",
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
// Contact Route
// ===============================
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({
      success: false,
      message: "⚠️ All fields (name, email, message) are required.",
    });
  }

  try {
    // Save message in MongoDB
    const newContact = await Contact.create({ name, email, message });

    // Send email via SendGrid API
    await sendMail({
      fromName: name,
      fromEmail: email,
      subject: "New Message from CORRONiL CONTROL Website",
      text: message,
    });

    res.status(201).json({
      success: true,
      message: "✅ Your message has been saved and email sent successfully!",
      data: newContact,
    });
  } catch (error) {
    console.error("❌ Error in /api/contact:", error);
    res.status(500).json({
      success: false,
      message: "🚫 Server error. Please try again later.",
    });
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
