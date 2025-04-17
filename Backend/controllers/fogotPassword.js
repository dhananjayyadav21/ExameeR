const userModel = require('../model/User'); 
const bcrypt = require('bcrypt');
const {sendForgotPasswordEmail} = require("../services/sendEmails")

const resetPassword = async (req, res) => {
    try {
        const { Email, ForgotPasswordCode, NewPassword, ConfirmNewPassword } = req.body;

        // 1. Input Validation
        if (!Email || !ForgotPasswordCode || !NewPassword || !ConfirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (NewPassword !== ConfirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "New Password and Confirm New Password do not match"
            });
        }

        //  Password Strength Validation (Important Security Practice)
        if (NewPassword.length < 6) { // Example: Minimum length of 8
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }
        // You can add more password complexity checks here (e.g., require uppercase, lowercase, numbers, symbols)

        // 2. Find the User
        const user = await userModel.findOne({ Email: Email.toLowerCase() }); // Find by email

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // 3. Verify the ForgotPasswordCode
        if (user.ForgotPasswordCode !== ForgotPasswordCode) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code"
            });
        }

        // 4. Hash the New Password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(NewPassword, salt);

        // 5. Update the Password and Clear the ForgotPasswordCode
        user.Password = hashedNewPassword;
        await user.save();

        // 6. Send Success Response
        return res.status(200).json({
            success: true,
            message: "Password reset successfully.  You can now log in with your new password."
        });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({
            success: false,
            message: 'Reset Password server internal error'
        });
    }
};

const sendResetCode = async (req, res) => {
    try {
        const { Email } = req.body;

        if (!Email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await userModel.findOne({ Email: Email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Generate a unique ForgotPasswordCode
        const ForgotPasswordCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Store the ForgotPasswordCode in the user document
        user.ForgotPasswordCode = ForgotPasswordCode;
        await user.save();

        // Send the email with the ForgotPasswordCode
        await sendForgotPasswordEmail(Email, ForgotPasswordCode); //  Call the email sending function

        return res.status(200).json({
            success: true,
            message: "Verification code sent to your email."
        });

    } catch (error) {
        console.error("Send Code Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send verification code"
        });
    }
};

module.exports = { resetPassword, sendResetCode };

