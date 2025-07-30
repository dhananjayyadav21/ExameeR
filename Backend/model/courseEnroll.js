const mongoose = require('mongoose');

const CourseEnrollSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    college: {
        type: String,
        default: ''
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    progress: {
        type: Number,
        default: 0
    },
    certificateIssued: {
        type: Boolean,
        default: false
    }

});

module.exports = mongoose.model('CourseEnroll', CourseEnrollSchema);
