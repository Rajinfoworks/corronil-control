// contact.js
import express from "express";
import Contact from "../models/Contact.js";
import { sendMail } from "../mailer.js"; // Use SendGrid API

const router = express.Router();

// Single route to handle form submission
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "⚠️ All fields are required." });
  }

  try {
    // Save to MongoDB
    const newMessage = new Contact({ name, email, message });
    await newMessage.save();

    // Send email via SendGrid API
    await sendMail({
      fromName: name,
      fromEmail: email,
      subject: "New Message from CORRONiL CONTROL Website",
      text: message,
    });

    res.status(200).json({ success: true, message: "✅ Message saved and email sent!" });
  } catch (error) {
    console.error("❌ Error in contact form:", error);
    res.status(500).json({ success: false, message: "🚫 Server error. Try again later." });
  }
});

export default router;
