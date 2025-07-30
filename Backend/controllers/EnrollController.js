const CourseEnroll = require('../model/courseEnroll');
const Course = require('../model/courseModel');
const userModel = require('../model/User'); // Assuming user model file

// @desc    Enroll a user in a course
// @route   POST /api/enroll
// @access  Protected
const enrollInCourse = async (req, res) => {
    try {
        const { name, email, mobile, college, courseId } = req.body;
        const userId = req.user._id;

        // Validate user
        const user = await userModel.findById(userId).select('-Password -ForgotPasswordCode');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found!',
            });
        }

        // Check existing enrollment
        const existingEnrollment = await CourseEnroll.findOne({ userId, courseId });
        if (existingEnrollment) {
            return res.status(400).json({
                success: false,
                message: 'User already enrolled in this course.'
            });
        }

        // Get course and check if free
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found!'
            });
        }

        if (course.offerPrice === 0) {
            const enrollment = new CourseEnroll({
                userId,
                name,
                email,
                mobile,
                college,
                courseId
            });

            await enrollment.save();

            return res.status(201).json({
                success: true,
                message: 'Enrolled successfully',
                data: enrollment,
                courseData: course
            });
        } else {
            return res.status(403).json({
                success: false,
                message: 'This course requires payment.'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server error during enrollment',
            error: err.message
        });
    }
};

// @desc    Get all enrollments (Admin/Instructor use)
// @route   GET /api/enrollments
// @access  Admin or Instructor

// const getAllEnrollments = async (req, res) => {
//     try {
//         const enrollments = await CourseEnroll.find()
//             .populate('userId', 'username email')
//             .populate('courseId', 'title');

//         res.status(200).json({
//             success: true,
//             message: 'All enrollments fetched',
//             data: enrollments
//         });
//     } catch (err) {
//         res.status(500).json({
//             success: false,
//             message: 'Server error while fetching enrollments',
//             error: err.message
//         });
//     }
// };

// @desc    Get enrollment by user and course
// @route   GET /api/enrollments/:userId/:courseId
// @access  Protected

// const getEnrollmentByUserAndCourse = async (req, res) => {
//     const { userId, courseId } = req.params;

//     try {
//         const enrollment = await CourseEnroll.findOne({ userId, courseId })
//             .populate('courseId', 'title');

//         if (!enrollment) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Enrollment not found'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: 'Enrollment fetched successfully',
//             data: enrollment
//         });
//     } catch (err) {
//         res.status(500).json({
//             success: false,
//             message: 'Server error while fetching enrollment',
//             error: err.message
//         });
//     }
// };

// @desc    Update enrollment progress or status
// @route   PUT /api/enrollments/:id

// @access  Instructor/Admin
// const updateEnrollment = async (req, res) => {
//     const { id } = req.params;
//     const { progress, status, certificateIssued } = req.body;

//     try {
//         const enrollment = await CourseEnroll.findByIdAndUpdate(
//             id,
//             { progress, status, certificateIssued },
//             { new: true }
//         );

//         if (!enrollment) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Enrollment not found'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: 'Enrollment updated successfully',
//             data: enrollment
//         });
//     } catch (err) {
//         res.status(500).json({
//             success: false,
//             message: 'Server error while updating enrollment',
//             error: err.message
//         });
//     }
// };

// @desc    Delete an enrollment
// @route   DELETE /api/enrollments/:id
// @access  Admin

// const deleteEnrollment = async (req, res) => {
//     try {
//         const enrollment = await CourseEnroll.findByIdAndDelete(req.params.id);

//         if (!enrollment) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Enrollment not found'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: 'Enrollment deleted successfully'
//         });
//     } catch (err) {
//         res.status(500).json({
//             success: false,
//             message: 'Server error while deleting enrollment',
//             error: err.message
//         });
//     }
// };

module.exports = {
    enrollInCourse,
};
