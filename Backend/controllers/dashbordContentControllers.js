const Note = require('../model/notesModel');
const PYQ = require("../model/pyqModel");
const Video = require("../model/videoModel");
const userModel = require("../model/User");

// ------[ NOTES: Get all notes detail ] -------
const dasContentDeatails = async (req, res) => {

    try {
        let userId = req.user._id;
        const category = (req.query.category !== undefined && req.query.category !== null && req.query.category !== '')
            ? req.query.category
            : "sciTechnology";

        const status = (req.query.status !== undefined && req.query.status !== null && req.query.status !== '')
            ? req.query.status
            : "public";

        const searchType = (req.query.type !== undefined && req.query.type !== null  && req.query.type !== '')
            ? req.query.type
            : "notes";

        const search = (req.query.search !== undefined && req.query.search !== null && req.query.search !== '')
            ? req.query.search
            : a;

            console.log(category,status, search, searchType)

        const regex = new RegExp(search, 'i');

        // check user exist or not
        const user = await userModel.findById(userId).select('-Password -ForgotPasswordCode');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found !',
            })
        }

        if (user.Role === "Instructor") {

            //------ if serch notes--------------------------
            if (searchType === "notes") {
                const result = await Note.find({
                    status: status,
                    category: category,
                    ExmeeUserId: user.ExmeeUserId,
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
                    type: "notes",
                    results: result
                })
            }


            //------ if serch pyq--------------------------
            if (searchType === "pyq") {

                const result = await PYQ.find({
                    status: status,
                    category: category,
                    ExmeeUserId: user.ExmeeUserId,
                    $or: [
                        { title: regex },
                        { description: regex },
                        { professor: regex },
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
                    type: "pyq",
                    results: result
                })


            }

            //------ if serch video--------------------------
            if (searchType === "video") {

                const result = await Video.find({
                    status: status,
                    category: category,
                    ExmeeUserId: user.ExmeeUserId,
                    $or: [
                        { title: regex },
                        { description: regex },
                        { professor: regex },
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
                    type: "video",
                    results: result
                })
            }
        }

        if (user.Role === "Admin") {
            //------ if serch notes--------------------------
            if (searchType === "notes") {
                const result = await Note.find({
                    status: status,
                    category: category,
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
                    type: "notes",
                    results: result
                })
            }


            //------ if serch pyq--------------------------
            if (searchType === "pyq") {

                const result = await PYQ.find({
                    status: status,
                    category: category,
                    $or: [
                        { title: regex },
                        { description: regex },
                        { professor: regex },
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
                    type: "pyq",
                    results: result
                })


            }

            //------ if serch video--------------------------
            if (searchType === "video") {

                const result = await Video.find({
                    status: status,
                    category: category,
                    $or: [
                        { title: regex },
                        { description: regex },
                        { professor: regex },
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
                    type: "video",
                    results: result
                })
            }
            
        }
    } catch (error) { // if accured some error
        console.error(error);
        return res.status(500).json({ //if accured error
            success: false,
            message: 'Server error : somthing went Wrrong in searching results!',
        })
    }
};


module.exports = { dasContentDeatails }