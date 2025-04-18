const userModel = require('../model/User');

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

module.exports = verifyEmail;