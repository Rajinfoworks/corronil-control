// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:");
    console.error(err.message || err);
    process.exit(1); // Exit process if DB connection fails
  }
};

// Optional: Log when connection is disconnected or encounters error after initial connect
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected!");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

module.exports = connectDB;
