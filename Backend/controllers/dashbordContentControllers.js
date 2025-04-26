const bcrypt = require('bcrypt');
const Note = require('../model/notesModel');
const PYQ = require("../model/pyqModel");
const Video = require("../model/videoModel");
const userModel = require("../model/User");
const MyLearningContent = require('../model/myLearning');

// ------[  Get all notes, pyq, video, detail ] -------
const dasContentDeatails = async (req, res) => {

    try {
        let userId = req.user._id;
        const category = (req.query.category !== undefined && req.query.category !== null && req.query.category !== '')
            ? req.query.category
            : "sciTechnology";

        const status = (req.query.status !== undefined && req.query.status !== null && req.query.status !== '')
            ? req.query.status
            : "public";

        const searchType = (req.query.type !== undefined && req.query.type !== null && req.query.type !== '')
            ? req.query.type
            : "notes";

        const search = req.query.search;
        if (!search) {
            return res.status(400).json({
                success: false,
                message: 'Search Field is empty !',
            })
        }

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

// ------[  Get all analytics dashbord ] -------
const dashbordAnlytics = async (req, res) => {
    const userId = req.user._id;

    // Get the user
    const user = await userModel.findById(userId).select('-Password -ForgotPasswordCode');
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found!',
        });
    }

    if (user.Role !== 'Instructor' && user.Role !== 'Admin') {
        return res.status(400).json({
            success: false,
            message: 'You are not able to use this features !',
        });
    }

    const isInstructor = user.Role === 'Instructor';
    const isAdmin = user.Role === 'Admin';

    const calcGrowth = (current, previous) => {
        if (previous === 0) return current === 0 ? 0 : 100;
        return (((current - previous) / previous) * 100).toFixed(2);
    };

    try {
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);

        const models = { notes: Note, videos: Video, pyqs: PYQ };
        const results = {};

        for (const key in models) {
            const Model = models[key];

            // 👇 Add base filter (only non-deleted)
            const baseFilter = { deletedAt: null };

            // 👇 Add author filter if instructor
            if (isInstructor) {
                baseFilter.uploadedBy = userId; // Assuming createdBy field stores the author's id
            }

            const currentMonthFilter = {
                ...baseFilter,
                createdAt: { $gte: oneMonthAgo }
            };

            const lastMonthFilter = {
                ...baseFilter,
                createdAt: { $lt: oneMonthAgo }
            };

            const currentCount = await Model.countDocuments(currentMonthFilter);
            const lastMonthCount = await Model.countDocuments(lastMonthFilter);
            const totalCount = await Model.countDocuments(baseFilter);

            results[key] = {
                total: totalCount,
                growth: calcGrowth(currentCount, lastMonthCount)
            };
        }

        return res.status(200).json({
            success: true,
            message: 'Your analytics data!',
            data: {
                notes: results.notes,
                videos: results.videos,
                pyqs: results.pyqs
            }
        });


    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: 'Some error on fetching analytics data!',
        });
    }
};




// ------[  Get student by roles ] -------
const getStudentsByRole = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get the user
        const user = await userModel.findById(userId).select('-Password -ForgotPasswordCode');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found!',
            });
        }

        if (user.Role !== 'Admin' && user.Role !== 'Instructor') {
            // Admin gets all users
            return res.status(400).json({
                success: false,
                message: 'You are not able to use this featchers !',
            });
        }

        const status = (req.query.status === undefined || req.query.status === null || req.query.status === '')
            ? "active"
            : req.query.status;

        const search = req.query.search || "gmail";
        if (!search) {
            return res.status(400).json({
                success: false,
                message: 'Search Field is empty !',
            })
        }

        if (!search) {
            return res.status(400).json({
                success: false,
                message: 'Search Field is empty !',
            })
        }

        const regex = new RegExp(search, 'i');

        let studentIds = [];

        if (user.Role === 'Admin') {
            // Admin gets all users
            const students = await userModel.find({
                Role: 'Student',
                Status: status,
                $or: [
                    { Username: regex },
                    { Email: regex }
                ]
            }).select('-Password -ForgotPasswordCode');
            return res.status(200).json({
                success: true,
                message: 'students found!',
                students
            });
        }

        if (user.Role === 'Instructor') {
            // Instructor gets only students who added their content in MyLearning

            // Get instructor's uploaded content IDs
            const [noteIds, videoIds, pyqIds] = await Promise.all([
                Note.find({ uploadedBy: userId }).select('_id'),
                Video.find({ uploadedBy: userId }).select('_id'),
                PYQ.find({ uploadedBy: userId }).select('_id'),
            ]);

            const contentIds = [
                ...noteIds.map(n => n._id.toString()),
                ...videoIds.map(v => v._id.toString()),
                ...pyqIds.map(p => p._id.toString())
            ];

            // Find all MyLearning records where contentId is in instructor's uploads
            const learningRecords = await MyLearningContent.find({
                contentId: { $in: contentIds }
            }).select('userId');

            studentIds = [...new Set(learningRecords.map(l => l.userId.toString()))]; // remove duplicates

            // Fetch student details
            const students = await userModel.find({
                _id: { $in: studentIds },
                Role: 'Student',
                Status: status,
                $or: [
                    { Username: regex },
                    { Email: regex }
                ]
            }).select('-Password -ForgotPasswordCode');

            return res.status(200).json({
                success: true,
                message: 'students found!',
                students
            });
        }

        return res.status(403).json({
            success: false,
            message: 'Access denied!',
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// ------- [ add student ] ------------
const addStudent = async (req, res) => {
    try {
        const { Username, Email, Password, Status, isVerified } = req.body;

        const userId = req.user._id;
        const requester = await userModel.findById(userId).select('-Password -ForgotPasswordCode');

        // Check if requester is Admin or Instructor
        if (!requester || (requester.Role !== 'Admin' && requester.Role !== 'Instructor')) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Only Admin or Instructor can add students.'
            });
        }

        // Basic validation
        if (!Username || !Email || !Password) {
            return res.status(400).json({
                success: false,
                message: 'Username, Email, and Password are required.'
            });
        }

        // Check if email already exists
        const existingUser = await userModel.findOne({ Email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists.'
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        // create ExmeeUserIdBasedOnEmail for uniq id
        function userIdBasedOnEmail(userEmail) {
            const hash = [...userEmail].reduce((acc, char) => acc + char.charCodeAt(0), 0);
            return hash + Math.floor(Math.random() * 10000);
        }
        const ExmeeUserIdBasedOnEmail = userIdBasedOnEmail(Email);
        const ExmeeUserId = "Exa" + ExmeeUserIdBasedOnEmail;

        // Create new user
        const newUser = new userModel({
            Username,
            Email,
            Password: hashedPassword,
            Role: 'Student', // Force role to Student even if something else comes
            Status: Status || 'active',
            isVerified: isVerified || false,
            ExmeeUserId: ExmeeUserId
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: 'Student created successfully.',
            userId: newUser._id,
            ExameeId: newUser.ExmeeUserId,
            user: newUser
        });
    } catch (error) {
        console.error('Error adding student:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
};

// ------- [ Update student ] ------------
const updateStudent = async (req, res) => {
    try {
        const { Username, Email, Password, Status, isVerified } = req.body;

        const userId = req.user._id;
        const requester = await userModel.findById(userId).select('-Password -ForgotPasswordCode');

        // Check if requester is Admin or Instructor
        if (!requester || (requester.Role !== 'Admin' && requester.Role !== 'Instructor')) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Only Admin or Instructor can add students.'
            });
        }

        const { id } = req.params;
        const user = await userModel.findById(id);
        if (!user)
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });

        if (Username) user.Username = Username;
        if (Email) user.Email = Email;
        if (Password) {
            const salt = await bcrypt.genSalt(10);
            user.Password = await bcrypt.hash(Password, salt);
        }
        if (Status) user.Status = Status;
        if (isVerified) user.isVerified = isVerified;

        await user.save();
        return res.json({
            success: true,
            message: 'User updated successfully'
        });
    } catch (error) {
        console.error('Edit user error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Change status active/inactive
const changeStudentStatus = async (req, res) => {
    try {
        const userId = req.user._id;
        const requester = await userModel.findById(userId).select('-Password -ForgotPasswordCode');

        // Check if requester is Admin or Instructor
        if (!requester || (requester.Role !== 'Admin' && requester.Role !== 'Instructor')) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Only Admin or Instructor can change status.'
            });
        }

        const { id } = req.params;

        const user = await userModel.findById(id);
        if (!user)
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });

        user.Status = user.Status === 'active' ? 'inactive' : 'active';
        await user.save();

        return res.json({
            success: true,
            message: `User status changed to ${user.Status}`,
            user
        });
    } catch (error) {
        console.error('Change status error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Delete user
const deleteStudent = async (req, res) => {
    try {
        const userId = req.user._id;
        const requester = await userModel.findById(userId).select('-Password -ForgotPasswordCode');

        // Check if requester is Admin or Instructor
        if (!requester || (requester.Role !== 'Admin' && requester.Role !== 'Instructor')) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Only Admin or Instructor can change status.'
            });
        }

        const { id } = req.params;

        // First, delete the user
        const user = await userModel.findByIdAndDelete(id);
        if (!user)
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });

        // Then, delete user's MyLearning content
        await MyLearningContent.deleteMany({ UserId: id });

        return res.json({
            success: true,
            message: 'User and their learning content deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};



module.exports = { dasContentDeatails, dashbordAnlytics, getStudentsByRole, addStudent, updateStudent, changeStudentStatus, deleteStudent }