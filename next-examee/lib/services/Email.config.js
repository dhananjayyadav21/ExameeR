import nodemailer from 'nodemailer';

const MyEmail = process.env.EMAIL;
const PASS = process.env.PASS;

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

export default transporter;
