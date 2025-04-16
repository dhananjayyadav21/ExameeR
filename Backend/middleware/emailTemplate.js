export const VerificationEmail_Template = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Examee - Verification Code</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 0; margin: 0;">
  <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto;">
    <tr>
      <td style="background-color: #ffffff; padding: 20px 40px; text-align: center;">
        <!-- Brand Logo -->
        <img src="https://via.placeholder.com/150x50?text=Examee+Logo" alt="Examee Logo" style="max-width: 150px; margin-bottom: 10px;">
        <h2 style="color: #333;">Examee</h2>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 30px 40px;">
        <h3 style="color: #333;">Your Verification Code</h3>
        <p style="font-size: 16px; color: #555;">
          Use the following 6-digit code to verify your account:
        </p>
        <div style="font-size: 28px; font-weight: bold; letter-spacing: 5px; background-color: #f1f1f1; padding: 15px; text-align: center; color: #222; border-radius: 8px;">
          {{VERIFICATION_CODE}}
        </div>
        <p style="font-size: 14px; color: #999; margin-top: 30px;">
          If you did not request this, please ignore this email.
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f9f9f9; padding: 20px; text-align: center; color: #aaa; font-size: 12px;">
        &copy; 2025 Examee. All rights reserved.
      </td>
    </tr>
  </table>
</body>
</html>
`

export const WelcomeEmail_Template = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to Examee</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; font-family: Arial, sans-serif;">
    <tr>
      <td style="padding: 20px 40px; text-align: center;">
        <!-- Brand Logo -->
        <img src="https://via.placeholder.com/150x50?text=Examee+Logo" alt="Examee Logo" style="max-width: 150px; margin-bottom: 10px;">
        <h1 style="margin: 0; color: #333;">Welcome to Examee!</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px 40px; color: #555;">
        <p style="font-size: 16px; line-height: 1.6;">
          Hi <strong>{{USERNAME}}</strong>,
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          We're excited to have you on board! Examee is your go-to platform for reliable, secure, and fast examination and learning tools.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          You're now part of a growing community of learners and professionals. Get started by exploring your dashboard, updating your profile, or accessing your personalized exam tools.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          If you have any questions or need help, feel free to contact our support team anytime.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          Happy learning! 🎉<br>
          — The Examee Team
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f9f9f9; text-align: center; padding: 20px; color: #999; font-size: 12px;">
        &copy; 2025 Examee. All rights reserved.
      </td>
    </tr>
  </table>
</body>
</html>
`