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
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif;">

  <!-- Preheader -->
  <div style="display:none; max-height:0; overflow:hidden; color:#f4f6f8;">
    Welcome to Examee – Start your learning journey today!
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
    
    <!-- Header -->
    <tr>
      <td style="background-color: #2e7d32; padding: 40px 20px; text-align: center;">
        <img src="https://newexamee.netlify.app/assets/img/brandlog.png" alt="Examee Logo - Smart and Secure Learning" style="max-width: 140px; margin-bottom: 16px;" />
        <h1 style="margin: 0; font-size: 26px; color: #ffffff;">Welcome to Examee, {{USERNAME}}!</h1>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 32px 40px; color: #333333; line-height: 1.6; font-size: 16px;">
        <p style="margin-top: 0;">Hi <strong>{{USERNAME}}</strong>,</p>
        <p>We’re excited to have you on board at <strong>Examee</strong> – the smart and secure platform built to empower your learning journey.</p>
        <p>Explore your dashboard, manage exams, and unlock personalized tools designed to help you succeed.</p>
        <p>Need help? Our friendly support team is just a click away.</p>
        <p>Wishing you success, growth, and a great learning experience! 🎉</p>
        <p style="margin-bottom: 0;">
          <strong style="color: #2e7d32;">– The Examee Team</strong>
        </p>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://newexamee.netlify.app" style="background-color: #2e7d32; color: #ffffff; padding: 14px 28px; text-decoration: none; font-size: 16px; border-radius: 8px; font-weight: bold; display: inline-block;">
            Go to learn
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #f1f8e9; text-align: center; padding: 20px; font-size: 13px; color: #777;">
        &copy; 2025 <strong style="color: #2e7d32;">Examee</strong>. All rights reserved.<br />
        <a href="https://newexamee.netlify.app" style="color: #2e7d32; text-decoration: none;">Visit us at www.examee.com</a>
      </td>
    </tr>

    <!-- Optional: Social Media Links -->
    <tr>
      <td style="text-align: center; padding: 16px;">
        <a href="https://www.instagram.com/iamneell_ig/" style="margin: 0 6px; text-decoration: none;">
          <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width="24" height="24" />
        </a>
        <a href="https://www.youtube.com/@exameecode" style="margin: 0 6px; text-decoration: none;">
          <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YouTube" width="24" height="24" />
        </a>
        <a href="https://www.linkedin.com/in/dhananjayyadav18" style="margin: 0 6px; text-decoration: none;">
          <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="LinkedIn" width="24" height="24" />
        </a>
      </td>
    </tr>
  </table>
</body>
</html>`