// controllers/searchController.js
const Note = require('../model/notesModel');
const PYQ = require("../model/pyqModel");
const Video = require("../model/videoModel");

const searchContent = async (req, res) => {
    try {
        const query = req.query.search;
        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is empty.!',
            })
        }
        const regex = new RegExp(query, 'i');

        const [notes, pyqs, videos] = await Promise.all([
            Note.find({
                status: 'public',
                deletedAt: null,
                $or: [
                    { title: regex },
                    { description: regex },
                    { professor: regex },
                    { tags: regex }
                ]
            }).lean().then(data => data.map(item => ({ ...item, type: 'note' }))),

            PYQ.find({
                status: 'public',
                deletedAt: null,
                $or: [
                    { title: regex },
                    { subject: regex },
                    { tags: regex }
                ]
            }).lean().then(data => data.map(item => ({ ...item, type: 'pyq' }))),

            Video.find({
                status: 'public',
                deletedAt: null,
                $or: [
                    { title: regex },
                    { description: regex },
                    { tags: regex }
                ]
            }).lean().then(data => data.map(item => ({ ...item, type: 'video' })))
        ]);

        const combinedResults = [...notes, ...pyqs, ...videos];
        if (combinedResults.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No matching content found',
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Here found some result!',
            results: combinedResults
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Server error : somthing went Wrrong in searching results!',
        })
    }
};

module.exports = { searchContent };
