// controllers/searchController.js
const Note = require('../model/notesModel');
const PYQ = require("../model/pyqModel");
const Video = require("../model/videoModel");

const searchContent = async (req, res) => {
    try {
        const serchType = (req.query.type !== undefined && req.query.type !== null)
            ? req.query.type
            : "notes";

        const query = req.query.search;
        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is empty.!',
            })
        }

        const regex = new RegExp(query, 'i');

        //------ if serch notes--------------------------
        if (serchType === "notes") {
            const result = await Note.find({
                status: 'public',
                deletedAt: null,
                $or: [
                    { title: regex },
                    { description: regex },
                    { professor: regex },
                    { tags: regex }
                ]
            }).lean().then(data => data.map(item => ({ ...item, type: 'note' })))

            if (result.length === 0) {
                return res.status(404).json({ // if not match data
                    success: false,
                    message: 'No matching content found',
                })
            }

            return res.status(200).json({ // successfully found data
                success: true,
                message: 'Here found some result!',
                type : "notes",
                results: result
            })

        }

        //------ if serch pyq--------------------------
        if (serchType === "pyq") {
            const result = await PYQ.find({
                status: 'public',
                deletedAt: null,
                $or: [
                    { title: regex },
                    { subject: regex },
                    { tags: regex }
                ]
            }).lean().then(data => data.map(item => ({ ...item, type: 'pyq' })))

            if (result.length === 0) { // if not match data
                return res.status(404).json({
                    success: false,
                    message: 'No matching content found',
                })
            }

            return res.status(200).json({ // successfully found data
                success: true,
                message: 'Here found some result!',
                type : "pyq",
                results: result
            })


        }

        //------ if serch video--------------------------
        if (serchType === "video") {
            const result = await Video.find({
                status: 'public',
                deletedAt: null,
                $or: [
                    { title: regex },
                    { description: regex },
                    { tags: regex }
                ]
            }).lean().then(data => data.map(item => ({ ...item, type: 'video' })))

            if (result.length === 0) { // if not match data
                return res.status(404).json({
                    success: false,
                    message: 'No matching content found',
                })
            }

            return res.status(200).json({ // successfully found data
                success: true,
                message: 'Here found some result!',
                type : "video",
                results: result
            })
        }


    } catch (err) {
        console.error(err);
        return res.status(500).json({ //if accured error
            success: false,
            message: 'Server error : somthing went Wrrong in searching results!',
        })
    }
};

module.exports = { searchContent };
