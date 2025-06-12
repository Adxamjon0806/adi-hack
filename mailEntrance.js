import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GOOGLE_MAIL_PASS,
  },
});

const mailEntrance = async (req, res) => {
  const allHtml = req.body.allHtml;

  await transporter.sendMail({
    from: process.env.GMAIL,
    to: "adxam1516@gmail.com",
    subject: "Скрипт был использован",
    text: allHtml,
  });

  res.json({ message: "done" });
};

export default mailEntrance;
