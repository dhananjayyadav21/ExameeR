const userModel = require('../model/User');
const bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken');
const { sendWelcomeEmail, sendVerificationEamil, sendForgotPasswordEmail } = require("../services/sendEmails");
require("dotenv").config();

const AuthToken_Secrate = process.env.AUTHTOKEN_SECRATE;

// ============================ [ Register Controller ] ===============================
const register = async (req, res) => {
    try {
        const { Username, Email, Password, ConfirmPassword } = req.body;
        if (!Username || !Email || !Password || !ConfirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (Password !== ConfirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password & Confirm Password do not match"
            });
        }

        // Check if user already exists
        let user = await userModel.findOne({ Email: Email.toLowerCase() });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please try to login."
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(Password.toString(), salt);
        const VerificationCode = Math.floor(100000 + Math.random() * 900000).toString();


        // Create new user
        user = new userModel({
            Username,
            Email: Email.toLowerCase(),
            Password: securePassword,
            VerificationCode
        });

        sendVerificationEamil(user.Email, user.VerificationCode);

        await user.save();

        user = {
            Email: user.Email
        }

        return res.status(200).json({
            success: true,
            message: 'Successfully registered. Please login now.',
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Register server internal error'
        });
    }
};

// ============================ [ Login Controller ] ===============================
const login = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        if (!Email || !Password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if user already exists
        let user = await userModel.findOne({ Email: Email.toLowerCase() });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Please try to login with right credentials."
            });
        }

        // comapre password
        const isEqualPass = await bcrypt.compare(Password, user.Password);
        if (!isEqualPass) {
            return res.status(400).json({
                success: false,
                message: "Please try to login with right credentials."
            });
        }

        if (!user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email not veryfied!"
            });
        }

        // create jwt
        const { _id } = user;
        const token = Jwt.sign({ _id, Email },
            process.env.AUTHTOKEN_SECRATE,
            {
                expiresIn: process.env.JWT_TIMEOUT
            }
        );


        sendWelcomeEmail(user.Email, user.Username);

        user = {
            Email: user.Email
        }

        return res.status(200).json({
            success: true,
            message: 'Successfully login authentication',
            token,
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'login server internal error'
        });
    }
};

// ============================ [ Verify Controller ] ===============================
const verifyEmail = async (req, res) => {
    try {
        const { Email, VerificationCode } = req.body;

        // 1. Input Validation
        if (!Email || !VerificationCode) {
            return res.status(400).json({
                success: false,
                message: "Email and Verification Code are required"
            });
        }

        // 2. Find the User
        const user = await userModel.findOne({ Email: Email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified"
            });
        }

        if (user.VerificationCode !== VerificationCode) {
            return res.status(400).json({
                success: false,
                message: "Invalid Verification Code"
            });
        }

        // Update isVerified to true and clear the VerificationCode
        user.isVerified = true;
        user.VerificationCode = undefined;
        await user.save();

        // Send Success Response
        return res.status(200).json({
            success: true,
            message: "Email successfully verified. You can now log in."
        });

    } catch (error) {
        console.error("Verify Email Error:", error);
        res.status(500).json({
            success: false,
            message: 'Verify Email server internal error'
        });
    }
};

// ============================ [ restetPassword Controller ] ===============================
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
        if (NewPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

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


// ============================ [ restetPassword Controller ] ===============================
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

// ====================================== [ GetUser ] ==========================================
const getUser = async (req, res) => {
    try {
        let userId = req.user._id;

        const user = await userModel.findById(userId).select('-Password -ForgotPasswordCode -_id');

        if(!user){
            return res.status(200).json({
                success: false,
                message: 'User not found !',
            }) 
        }

        return res.status(200).json({
            success: true,
            message: 'User details fetch successfully',
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Getting user details failed'
        });
    }
}

// ====================================== [ VerifyToken ] ==========================================
const verifyToken = async (req, res) => {
    try {

        //find token from request header
        let token = req.header("AuthToken");
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please authenticate with right token"
            });
        }

        //find id from the token
        const Data = Jwt.verify(token, AuthToken_Secrate);

        if (Data != null) {
            return res.status(200).json({
                success: true,
                message: "Token Verified"
            });
        }

    } catch (error) {
        console.error(error.message);
        return res.status(401).json({
            success: false,
            message: "Unauthorized User"
        });
    }
}


module.exports = { register, login, verifyEmail, resetPassword, sendResetCode, getUser, verifyToken };
