export const VerificationEmail_Template = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Examee - Verification Code</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #e6f4ea; padding: 0; margin: 0;">
  <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto;">
    <tr>
      <td style="background-color: #ffffff; padding: 20px 40px; text-align: center;">
        <!-- Brand Logo -->
        <img src="https://newexamee.netlify.app/assets/img/brandlog.png" alt="Examee Logo" style="max-width: 150px; margin-bottom: 10px;">
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 30px 40px;">
        <h3 style="color: #2e7d32;">Your Verification Code</h3>
        <p style="font-size: 16px; color: #555;">
          Use the following 6-digit code to verify your account:
        </p>
        <div style="font-size: 28px; font-weight: bold; letter-spacing: 5px; background-color: #e0f2f1; padding: 15px; text-align: center; color: #1b5e20; border-radius: 8px;">
          {{VERIFICATION_CODE}}
        </div>
        <p style="font-size: 14px; color: #999; margin-top: 30px;">
          If you did not request this, please ignore this email.
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f1f8e9; padding: 20px; text-align: center; color: #666; font-size: 12px;">
        &copy; 2025 <span style="color: #2e7d32;">Examee</span>. All rights reserved.
      </td>
    </tr>
  </table>
</body>
</html>`

export const WelcomeEmail_Template = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Welcome to Examee</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin: 0; padding: 0; background-color: #e8f5e9; font-family: 'Segoe UI', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
    
    <!-- Header -->
    <tr>
      <td style="background-color: #2e7d32; padding: 30px 20px; text-align: center;">
        <!-- Replace with your actual logo hosted at newexamee.netlify.app -->
        <img src="https://newexamee.netlify.app/assets/img/brandlog.png" alt="Examee Logo" style="max-width: 160px; margin-bottom: 10px;" />
        <h1 style="margin: 10px 0 0; font-size: 24px; color: #ffffff;">Welcome to Examee!</h1>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 30px 40px; color: #444; line-height: 1.6;">
        <p style="font-size: 16px; margin-top: 0;">Hi <strong>{{USERNAME}}</strong>,</p>
        <p style="font-size: 16px;">
          We're thrilled to have you join us at <strong>Examee</strong> — your smart and secure learning platform. Whether you're a student, educator, or professional, Examee is designed to help you succeed.
        </p>
        <p style="font-size: 16px;">
          Your journey begins now. Head over to your dashboard to explore tools, manage exams, and personalize your learning experience.
        </p>
        <p style="font-size: 16px;">
          If you need assistance, our friendly support team is always here to help you.
        </p>
        <p style="font-size: 16px;">
          Happy learning! 🎉<br />
          <span style="color: #2e7d32;"><strong>— The Examee Team</strong></span>
        </p>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://newexamee.netlify.app" style="background-color: #2e7d32; color: #ffffff; padding: 14px 28px; text-decoration: none; font-size: 16px; border-radius: 6px; display: inline-block;">
            Go to learn
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #f1f8e9; text-align: center; padding: 20px; font-size: 12px; color: #777;">
        &copy; 2025 <strong style="color: #2e7d32;">Examee</strong>. All rights reserved.<br />
        <a href="https://newexamee.netlify.app" style="color: #2e7d32; text-decoration: none;">www.examee.com</a>
      </td>
    </tr>
  </table>
</body>
</html>`