const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
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
    Profile: {
        type: String
    }

}, { timestamps: true }
);

module.exports = mongoose.model('Users', UserSchema);
