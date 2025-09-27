// mailer.js
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendMail = async ({ fromName, fromEmail, subject, text }) => {
  await sgMail.send({
    to: process.env.EMAIL_RECEIVER,
    from: "c.control2005@gmail.com", // replies go to your Gmail
    subject,
    text: `Name: ${fromName}\nEmail: ${fromEmail}\nMessage: ${text}`,
  });
};
