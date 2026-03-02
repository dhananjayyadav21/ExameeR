import mongoose from 'mongoose';

const mockTestAttemptSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    mockTestId: { type: mongoose.Schema.Types.ObjectId, ref: 'MockTest', required: true },
    score: { type: Number, required: true },
    totalScore: { type: Number, required: true },
    percentage: { type: Number, required: true },
    durationTaken: { type: Number, default: 0 }, // in seconds
    isPassed: { type: Boolean, default: false },
    attemptedAt: { type: Date, default: Date.now },
});

export default mongoose.models.MockTestAttempt || mongoose.model('MockTestAttempt', mockTestAttemptSchema);
