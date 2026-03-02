export const VerificationEmail_Template = (Email, VerificationCode) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Examee Email</title>
</head>
<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 40px 20px; margin: 0; line-height: 1.6;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); overflow: hidden;">
        <tr>
            <td style="background: linear-gradient(135deg, #04bd20 0%, #064e3b 100%); padding: 40px; text-align: center;">
                <img src="https://examee.netlify.app/assets/img/brandlog.png" alt="Examee Logo" style="max-width: 140px; filter: brightness(0) invert(1);">
            </td>
        </tr>
        <tr>
            <td style="padding: 40px;">
                <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; margin: 0 0 16px 0; text-align: center;">Security Verification</h1>
                <p style="font-size: 16px; color: #475569; margin: 0 0 24px 0; text-align: center;">
                    Thank you for choosing Examee. To ensure the security of your account, please verify your email address.
                </p>
                <div style="background-color: #f1f5f9; padding: 24px; text-align: center; border-radius: 16px; margin-bottom: 32px; border: 1px dashed #cbd5e1;">
                    <p style="font-size: 13px; color: #64748b; margin: 0 0 8px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Your Verification Code</p>
                    <div style="font-size: 42px; font-weight: 900; letter-spacing: 8px; color: #04bd20;">
                        ${VerificationCode}
                    </div>
                </div>
                <div style="text-align: center;">
                    <a href="https://examee.netlify.app/verifyEmail?Email=${Email}&VerificationCode=${VerificationCode}" style="display: inline-block; background-color: #04bd20; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(4,189,32,0.3);">
                        Confirm Verification
                    </a>
                </div>
                <p style="font-size: 14px; color: #94a3b8; margin: 32px 0 0 0; text-align: center; font-style: italic;">
                    This link will expire in 15 minutes. If you didn't request this, please ignore this email.
                </p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 12px; border-top: 1px solid #f1f5f9;">
                <p style="margin: 0 0 8px 0;">&copy; 2026 <strong>Examee</strong>. Your Premium Learning Partner.</p>
                <p style="margin: 0;">www.examee.com | Support: support@examee.com</p>
            </td>
        </tr>
    </table>
</body>
</html>`;

export const WelcomeEmail_Template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Examee</title>
</head>
<body style="font-family: 'Inter', sans-serif; background-color: #f8f9fa; padding: 40px 20px; margin: 0; line-height: 1.6; color: #2d3748;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.08); overflow: hidden;">
        <tr>
            <td style="background: linear-gradient(to right, #04bd20, #064e3b); padding: 50px 40px; text-align: center;">
                <img src="https://examee.netlify.app/assets/img/brandlog.png" alt="Examee" style="max-width: 140px; margin-bottom: 12px; filter: brightness(0) invert(1);">
                <h1 style="color: #ffffff; font-size: 28px; font-weight: 900; margin: 0; letter-spacing: -0.5px;">Welcome to the Future, {{USERNAME}}!</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 40px;">
                <p style="font-size: 18px; color: #1a202c; font-weight: 700; margin-bottom: 16px;">Hello {{USERNAME}},</p>
                <p style="font-size: 16px; margin-bottom: 24px;">We are thrilled to welcome you to the <strong>Examee community</strong>. You've just taken your first step towards academic excellence.</p>
                
                <div style="background-color: #f0fdf4; border-left: 4px solid #04bd20; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
                    <p style="margin: 0; color: #064e3b; font-weight: 600; font-size: 14px;">"The beautiful thing about learning is that no one can take it away from you."</p>
                </div>

                <p style="font-size: 15px; font-weight: 700; text-transform: uppercase; color: #4a5568; letter-spacing: 0.1em; margin-bottom: 20px;">What's next for you?</p>
                
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                    <tr>
                        <td style="padding-bottom: 15px;">
                            <span style="display: inline-block; width: 8px; height: 8px; background: #04bd20; border-radius: 50%; margin-right: 12px;"></span>
                            <span style="font-size: 15px;">Access premium study notes & PDFs</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 15px;">
                            <span style="display: inline-block; width: 8px; height: 8px; background: #04bd20; border-radius: 50%; margin-right: 12px;"></span>
                            <span style="font-size: 15px;">Explore previous examination papers (PYQ)</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 15px;">
                            <span style="display: inline-block; width: 8px; height: 8px; background: #04bd20; border-radius: 50%; margin-right: 12px;"></span>
                            <span style="font-size: 15px;">Personalized mock test series</span>
                        </td>
                    </tr>
                </table>

                <div style="text-align: center;">
                    <a href="https://examee.netlify.app/dashboard" style="display: inline-block; background: #1a202c; color: #ffffff; padding: 18px 40px; text-decoration: none; border-radius: 14px; font-weight: 800; font-size: 16px; transition: all 0.3s;">
                        Enter Your Dashboard →
                    </a>
                </div>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f7fafc; padding: 40px; text-align: center; color: #718096; font-size: 13px;">
                <p style="margin: 0 0 12px 0;">Follow your journey on <strong>www.examee.com</strong></p>
                <div style="border-top: 1px solid #edf2f7; padding-top: 20px; margin-top: 20px;">
                    <p style="margin: 0;">&copy; 2026 Examee Technologies. All rights reserved.</p>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>`;

export const ForgotPasswordEmail_Template = (ForgotPasswordCode) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>
<body style="font-family: 'Inter', sans-serif; background-color: #fff5f5; padding: 40px 20px; margin: 0; line-height: 1.6;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 20px; box-shadow: 0 10px 30px rgba(220, 38, 38, 0.1); overflow: hidden;">
        <tr>
            <td style="background: linear-gradient(135deg, #ef4444 0%, #991b1b 100%); padding: 40px; text-align: center;">
                <img src="https://examee.netlify.app/assets/img/brandlog.png" alt="Examee Logo" style="max-width: 130px; filter: brightness(0) invert(1);">
            </td>
        </tr>
        <tr>
            <td style="padding: 40px;">
                <h2 style="color: #1f2937; font-size: 24px; font-weight: 800; margin: 0 0 16px 0; text-align: center;">Password Reset Request</h2>
                <p style="font-size: 16px; color: #4b5563; margin: 0 0 24px 0; text-align: center;">
                    We received a request to reset your password. Use the secure code below to proceed.
                </p>
                <div style="background-color: #fff1f2; padding: 24px; text-align: center; border-radius: 16px; margin-bottom: 30px; border: 1px solid #fecaca;">
                    <p style="font-size: 12px; color: #991b1b; margin: 0 0 8px 0; font-weight: 800; text-transform: uppercase;">Your Security Code</p>
                    <div style="font-size: 44px; font-weight: 900; letter-spacing: 10px; color: #dc2626;">
                        ${ForgotPasswordCode}
                    </div>
                </div>
                <p style="font-size: 14px; text-align: center; color: #6b7280;">
                    If you didn't request this, your account is safe – you can simply ignore this message.
                </p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; color: #9ca3af; font-size: 12px;">
                &copy; 2026 Examee Secure Identity. All rights reserved.
            </td>
        </tr>
    </table>
</body>
</html>`;

export const SupportEmail_Template = (name, email, subject, body) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Support Message Received</title>
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
            color: #1976d2;
            margin-top: 0;
        }
        .body-text {
            font-size: 16px;
            margin-bottom: 15px;
        }
        .info-block {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 15px;
        }
        .info-label {
            font-weight: bold;
            color: #555;
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
            <img src="https://examee.netlify.app/assets/img/brandlog.png" alt="Examee Logo" class="logo" />
            <h1 class="greeting">New Support Request</h1>
        </div>
        <div class="body-text">
            <p>Hello Admin,</p>
            <p>You’ve received a new support message from a user. The details are as follows:</p>

            <div class="info-block">
                <p><span class="info-label">Name:</span> ${name}</p>
                <p><span class="info-label">Email:</span> ${email}</p>
                <p><span class="info-label">Subject:</span> ${subject}</p>
                <p><span class="info-label">Message:</span></p>
                <p>${body}</p>
            </div>

            <p>Please address this request at your earliest convenience.</p>
            <p>Thanks,<br />The Examee Support System</p>
        </div>
        <div class="footer">
            <p>© 2025 Examee. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

export const CertificationPass_Template = (userName, testTitle, score, certificateId) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Congratulations on Your Certification!</title>
</head>
<body style="font-family: 'Inter', sans-serif; background-color: #f0fdf4; padding: 40px 20px; margin: 0;">
    <table align="center" width="100%" style="max-width: 600px; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(4,189,32,0.1);">
        <tr>
            <td style="background: linear-gradient(135deg, #04bd20 0%, #064e3b 100%); padding: 50px; text-align: center;">
                <div style="background: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; line-height: 80px;">
                    <span style="font-size: 40px;">🏆</span>
                </div>
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 900;">Certification Earned!</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 40px; text-align: center;">
                <p style="font-size: 18px; color: #1e293b; margin-bottom: 8px;">Outstanding work, <strong>${userName}</strong>!</p>
                <p style="font-size: 16px; color: #64748b; margin-bottom: 30px;">You have successfully cleared the professional assessment for:</p>
                
                <div style="background: #f8fafc; border: 2px solid #e2e8f0; padding: 24px; border-radius: 16px; margin-bottom: 32px;">
                    <h2 style="color: #04bd20; margin: 0 0 8px 0; font-size: 20px;">${testTitle}</h2>
                    <p style="margin: 0; color: #94a3b8; font-weight: 700; font-size: 14px; text-transform: uppercase;">Final Score: ${score}%</p>
                </div>

                <p style="font-size: 15px; color: #475569; margin-bottom: 32px;">Your official digital certificate is now available on your dashboard. You can download it and share your achievement on professional networks like LinkedIn.</p>
                
                <a href="https://examee.netlify.app/certificates" style="display: inline-block; background: #04bd20; color: #ffffff; padding: 18px 40px; text-decoration: none; border-radius: 14px; font-weight: 800; font-size: 16px; box-shadow: 0 10px 20px rgba(4,189,32,0.2);">
                    View My Certificate →
                </a>

                <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #f1f5f9;">
                    <p style="font-size: 12px; color: #94a3b8; margin: 0;">Verification ID: <strong>${certificateId}</strong></p>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>`;

export const CertificationFail_Template = (userName, testTitle, score) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Keep Going: Certification Result</title>
</head>
<body style="font-family: 'Inter', sans-serif; background-color: #fffaf0; padding: 40px 20px; margin: 0;">
    <table align="center" width="100%" style="max-width: 600px; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.05);">
        <tr>
            <td style="background: #1e293b; padding: 40px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800;">Assessment Completed</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 40px; text-align: center;">
                <p style="font-size: 18px; color: #1e293b; margin-bottom: 12px;">Hello ${userName},</p>
                <p style="font-size: 16px; color: #64748b; margin-bottom: 30px;">Thank you for attempting the <strong>${testTitle}</strong> certification.</p>
                
                <div style="background: #fff1f2; border: 1px solid #fecaca; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
                    <p style="margin: 0; color: #e11d48; font-weight: 700;">Score Achieved: ${score}%</p>
                    <p style="margin: 4px 0 0 0; font-size: 13px; color: #991b1b;">75% is required to earn the certification.</p>
                </div>

                <p style="font-size: 15px; color: #475569; margin-bottom: 24px; line-height: 1.6;">Don't be discouraged! This was a challenging assessment designed to validate true mastery. Use this time to review the core concepts and strengthen your knowledge.</p>
                
                <div style="background: #fefce8; border: 1px solid #fef08a; padding: 16px; border-radius: 12px; margin-bottom: 32px;">
                    <p style="margin: 0; color: #854d0e; font-size: 14px; font-weight: 600;">⚠️ You can re-attempt this certification in <strong>7 days</strong>.</p>
                </div>

                <a href="https://examee.netlify.app/dashboard" style="display: inline-block; background: #1e293b; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px;">
                    Back to Dashboard
                </a>
            </td>
        </tr>
    </table>
</body>
</html>`;
