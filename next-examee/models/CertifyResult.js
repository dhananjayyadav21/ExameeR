import mongoose from 'mongoose';

const CertifyResultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'CertifyTest', required: true },
    score: { type: Number, required: true }, // Percentage
    passed: { type: Boolean, required: true },
    lastAttemptedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for quick lookups by user and test
CertifyResultSchema.index({ userId: 1, testId: 1 });

export default mongoose.models.CertifyResult || mongoose.model('CertifyResult', CertifyResultSchema);
