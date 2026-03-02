import mongoose from 'mongoose';

const CertificateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    testTitle: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    certificateId: {
        type: String,
        unique: true,
        required: true
    }
}, { timestamps: true });

export default mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);
