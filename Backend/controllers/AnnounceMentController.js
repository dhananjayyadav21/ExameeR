const { announceMentEmail } = require("../services/sendEmails");
const userModel = require("../model/User");

//--- Admin: Get All Users (Basic Info) ------------
const getAllUsers = async (req, res) => {
    try {
        const userId = req.user._id;

        // Step 1: Find the logged-in user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found!'
            });
        }

        // Step 2: Check if user is Admin
        if (user.Role !== 'Admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied!'
            });
        }

        // Step 3: Retrieve all users (only basic details)
        const users = await userModel.find().select('_id Email Username');

        // Step 4: Return user list
        return res.status(200).json({
            success: true,
            data: users,
        });

    } catch (error) {
        // Handle server error
        console.error('Get Users Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching users!',
        });
    }
};

// Admin: Send Email Announcement to Multiple Users
const sendAnnouncement = async (req, res) => {
    try {
        const userId = req.user._id;
        const { userIds,subject, emailBody } = req.body;

        // Step 1: Get sender info
        const sender = await userModel.findById(userId).select('-Password -ForgotPasswordCode');
        if (!sender) {
            return res.status(404).json({
                success: false,
                message: 'Sender not found!'
            });
        }

        // Step 2: Verify sender is an Admin
        if (sender.Role !== 'Admin') {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized to send announcements!'
            });
        }

        // Step 3: Validate recipient list
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No recipients provided!'
            });
        }

        // Step 4: Validate email content
        if (!emailBody || emailBody.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Email body is required!'
            });
        }

        // Step 5: Fetch recipient emails
        const recipients = await userModel.find({ _id: { $in: userIds } }).select('Email');

        // Step 6: Send email to each recipient
        for (const recipient of recipients) {
            await announceMentEmail(recipient.Email, subject, emailBody);
        }

        // Step 7: Return success response
        return res.status(200).json({
            success: true,
            message: `Announcement sent to ${recipients.length} users.`,
        });

    } catch (error) {
        // Handle server error
        console.error('Send Announcement Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while sending announcement!',
        });
    }
};

// Export both controller functions
module.exports = { getAllUsers, sendAnnouncement };
