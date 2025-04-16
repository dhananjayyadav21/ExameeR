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
    <style>
        body {
            margin: 20px;
            padding: 0;
            background-color: #f4f6f8;
            font-family: 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .logo {
            max-width: 120px;
            margin-bottom: 10px;
        }
        .greeting {
            font-size: 22px;
            color: #2e7d32;
            margin-top: 0;
        }
        .body-text {
            font-size: 16px;
            margin-bottom: 15px;
        }
        .button {
            display: inline-block;
            background-color: #2e7d32;
            color: #ffffff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 25px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://newexamee.netlify.app/assets/img/brandlog.png" alt="Examee Logo" class="logo" />
            <h1 class="greeting">Welcome to Examee, {{USERNAME}}!</h1>
        </div>
        <div class="body-text">
            <p>Hi Dear,</p>
            <p>Welcome to Examee! We're happy to have you join our learning platform.</p>
            <p>Get started by exploring your dashboard and discovering the tools we have for you.</p>
            <p>If you need any assistance, our support team is here to help.</p>
            <p>Best regards,</p>
            <p>The Examee Team</p>
        </div>
        <div style="text-align: center;">
            <a href="https://newexamee.netlify.app" class="button" style="color:rgb(255, 255, 255); text-decoration: none;">Go to learn</a>
        </div>
        <div class="footer">
            <p>© 2025 Examee. All rights reserved.</p>
            <a href="https://newexamee.netlify.app" style="color: #2e7d32; text-decoration: none;">Visit us at www.examee.com</a>
        </div>
    </div>
</body>
</html>`