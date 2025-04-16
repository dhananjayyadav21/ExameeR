const userModel = require('../model/User');
const bcrypt = require('bcrypt');
const {sendVerificationEamil} = require("../services/sendEmails")

const register = async (req, res) => {
    try {
        const { Username, Email, Password } = req.body;
        if (!Username || !Email || !Password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
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
            Email:Email.toLowerCase(),
            Password: securePassword,
            VerificationCode
        });

        sendVerificationEamil(user.Email,user.VerificationCode);

        await user.save();
        
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

module.exports = register;
  