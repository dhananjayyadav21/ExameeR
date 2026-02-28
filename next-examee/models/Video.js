import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        enum: ['sciTechnology', 'commerce', 'artscivils'],
        default: 'sciTechnology',
    },
    tags: {
        type: [String],
        default: [],
    },
    isPublic: {
        type: Boolean,
        default: true,
    },
    status: {
        type: String,
        enum: ['public', 'draft', 'archived'],
        default: 'public',
    },
    fileUrl: {
        type: String,
        required: true,
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    ExmeeUserId: {
        type: String
    },
    deletedAt: {
        type: Date,
        default: null,
    }
}, { timestamps: true });

export default mongoose.models.Video || mongoose.model('Video', videoSchema);
