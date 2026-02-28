const nodemailer = require("nodemailer");
require("dotenv").config();

const MyEmail = process.env.EMAIL;
const PASS = process.env.PASS;

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: MyEmail,
    pass: PASS,
  },
});

module.exports = transporter;
