import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true,
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
    NotificationPrefs: {
        newCourse: { type: Boolean, default: true },
        notesUpdate: { type: Boolean, default: true },
        videoAlert: { type: Boolean, default: true }
    }
}, { timestamps: true });

export default mongoose.models.Users || mongoose.model('Users', UserSchema);
