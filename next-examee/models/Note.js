import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    professor: {
        type: String,
        required: true,
    },
    accessTier: {
        type: String,
        enum: ['free', 'plus', 'pro'],
        default: 'free',   // 'free' = E0, 'plus' = Plus+, 'pro' = Pro only
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
    tags: [String],
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

if (mongoose.models && mongoose.models.Note) {
    delete mongoose.models.Note;
}
export default mongoose.model('Note', noteSchema);
