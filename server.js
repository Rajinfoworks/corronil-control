const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ===== MongoDB Setup =====
mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log("✅ MongoDB connected to ganesh_engineers"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ===== Routes =====
const contactRoute = require("./routes/contact");
app.use("/api/contact", contactRoute);

// ===== Default Route =====
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===== Start Server =====
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
