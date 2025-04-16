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

// Send Email Function
async function sendEmail(Email, VerificationCode) {
  const mailOptions = {
    from: `"HealthCure" <${MyEmail}>`, // Sender name
    to: patientEmail,
    subject: `Appointment Status Updated - ${Email}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h4 style="color:rgb(197, 197, 197);">Dear ${Email},</h4>
        <p>
          Unfortunately, your appointment <br> (ID: <strong>${Email}</strong>)
          <span style="color: red;"><strong>${VerificationCode}</strong></span> due to a delay.
        </p>
        <p>You missed your scheduled appointment. Please reschedule at your earliest convenience to ensure timely care. You can reschedule your appointment using the link below:</p>
        <p style="text-align: center; margin: 20px 0;">
          <a 
            href="${VerificationCode}" 
            style="
              background-color: #2d89ef; 
              color: white; 
              padding: 10px 20px; 
              text-decoration: none; 
              border-radius: 5px;
              font-weight: bold;"
          >
            Reschedule Appointment
          </a>
        </p>
        <p>Thank you for choosing HealthCure.</p>
        <p style="font-size: 0.9em; color: #777;">Sincerely,<br>The HealthCure Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `Email sent to ${patientEmail} for appointment ID: ${appointmentId}`
    );
  } catch (error) {
    console.error(
      `Error sending email for appointment ID: ${appointmentId}`,
      error
    );
  }
}

module.exports = sendEmail;
