import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true,
        unique: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String
    },
    ExmeeUserId: {
        type: String
    },
    Role: {
        type: String,
        enum: ['Admin', 'Instructor', 'Student'],
        default: 'Student',
    },
    Status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    VerificationCode: {
        type: String
    },
    ForgotPasswordCode: {
        type: String
    },
    lastActive: {
        type: Date,
        default: null
    },
    FirstName: {
        type: String,
        default: ''
    },
    LastName: {
        type: String,
        default: ''
    },
    Institution: {
        type: String,
        default: ''
    },
    Fingerprint: {
        type: String
    },
    IPAddress: {
        type: String
    },
    Profile: {
        type: String
    },
    About: {
        type: String,
        default: ''
    },
    Phone: {
        type: String,
        default: ''
    },
    Gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', ''],
        default: ''
    },
    Location: {
        type: String,
        default: ''
    },
    Course: {
        type: String,
        default: ''
    },
    University: {
        type: String,
        default: ''
    },
    Semester: {
        type: String,
        default: ''
    },
    NotificationPrefs: {
        newCourse: { type: Boolean, default: true },
        notesUpdate: { type: Boolean, default: true },
        videoAlert: { type: Boolean, default: true }
    }
}, { timestamps: true });

if (mongoose.models && mongoose.models.Users) {
    delete mongoose.models.Users;
}
export default mongoose.model('Users', UserSchema);
