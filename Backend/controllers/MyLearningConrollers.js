const MyLearningModel = require("../model/myLearning");
const Note = require("../model/notesModel");
const Video = require("../model/videoModel");
const PYQ = require("../model/pyqModel");
const userModel = require("../model/User");

//----- Add Content In My Learning--------
const addInMylearning = async (req, res) => {
    try {
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
        });
    } catch (err) {
        console.error('Error while Adding in mylearning', err);
        return res.status(500).json({
            success: false,
            message: 'Server Error while Adding in mylearning',
        });
    }
};

//----- Get Content From Mylearning Content-----
const getDatafromMyLearning = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId).select('-Password -ForgotPasswordCode');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'You are not unauthorized user!',
            })
        }


        const learningEntries = await MyLearningModel.find({ userId });

        const notesIds = learningEntries
            .filter(entry => entry.contentType === 'Note')
            .map(entry => entry.contentId);

        const videoIds = learningEntries
            .filter(entry => entry.contentType === 'Video')
            .map(entry => entry.contentId);

        const pyqIds = learningEntries
            .filter(entry => entry.contentType === 'PYQ')
            .map(entry => entry.contentId);

        const [notesData, videoData, pyqData] = await Promise.all([
            Note.find({ _id: { $in: notesIds } }).select("-uploadedBy -ExmeeUserId -createdAt -updatedAt -deletedAt"),
            Video.find({ _id: { $in: videoIds } }).select("-uploadedBy -ExmeeUserId -createdAt -updatedAt -deletedAt"),
            PYQ.find({ _id: { $in: pyqIds } }).select("-uploadedBy -ExmeeUserId -createdAt -updatedAt -deletedAt"),
        ]);

        return res.status(200).json({
            success: true,
            message: 'Successfully fetch learning content from  mylearning ',
            notesData,
            videoData,
            pyqData
        });

    } catch (err) {
        console.error(err);
        console.error('Error while fetch learning content from  mylearning', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch My learning content',
        });
    }
};


//----- Remove Content From Mylearning Content-----
const removeFromMyLearning = async (req, res) => {
    try {
        const userId = req.user._id;
        const { contentId, contentType } = req.body;

        // Validate user
        const user = await userModel.findById(userId).select('-Password -ForgotPasswordCode');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Unauthorized user!',
            });
        }

        // Find and delete the entry
        const deletedEntry = await MyLearningModel.findOneAndDelete({
            userId,
            contentId,
            contentType,
        });

        if (!deletedEntry) {
            return res.status(404).json({
                success: false,
                message: 'Content not found in your MyLearning',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Content removed from MyLearning successfully',
        });
    } catch (err) {
        console.error('Error removing content from MyLearning:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to remove content from MyLearning',
        });
    }
};


module.exports = { addInMylearning, getDatafromMyLearning, removeFromMyLearning };
