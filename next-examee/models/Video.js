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
    accessTier: {
        type: String,
        enum: ['free', 'plus', 'pro'],
        default: 'free',
    },
    category: {
        type: String,
        enum: ['sciTechnology', 'commerce', 'artscivils'],
        default: 'sciTechnology',
    },
    course: {
        type: String,
        default: '',
    },
    semester: {
        type: String,
        default: '',
    },
    university: {
        type: String,
        default: '',
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

if (mongoose.models && mongoose.models.Video) {
    delete mongoose.models.Video;
}
export default mongoose.model('Video', videoSchema);
