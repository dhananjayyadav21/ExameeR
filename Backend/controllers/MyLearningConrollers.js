const MyLearningModel = require("../model/myLearning");
const userModel = require("../model/User");

const addInMylearning = async (req, res) => {
    let userId = req.user._id;
    const user = await userModel.findById(userId).select('-Password -ForgotPasswordCode');
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found !',
        })
    }

    const { contentId, contentType } = req.body;
    if (!contentId || !contentType) {
        return res.status(400).json({
            success: false,
            message: 'somthing Went Wrong!',
        });
    }

    try {
        const existing = await MyLearningModel.findOne({ userId, contentId, contentType });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'Content already exists in MyLearning',
            });
        }

        const entry = new MyLearningModel({ userId, contentId, contentType });
        await entry.save();
        return res.status(201).json({
            success: true,
            message: 'Content added to MyLearning',
            data: entry
        });
    } catch (err) {
        console.error('Error while Adding in mylearning', err);
        return res.status(500).json({
            success: false,
            message: 'Server Error while Adding in mylearning',
        });
    }
};

module.exports = { addInMylearning };
