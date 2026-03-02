import mongoose from 'mongoose';

const UsageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    month: {
        type: String, // format: "YYYY-MM"
        required: true
    },
    mockTestsTaken: {
        type: Number,
        default: 0
    },
    callsBooked: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Ensure unique entry per user per month
UsageSchema.index({ userId: 1, month: 1 }, { unique: true });

export default mongoose.models.Usage || mongoose.model('Usage', UsageSchema);
