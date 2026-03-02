import mongoose from 'mongoose';

const pyqSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        accessTier: {
            type: String,
            enum: ['free', 'plus', 'pro'],
            default: 'free',
        },
        year: {
            type: Number,
            required: true,
        },
        subject: {
            type: String,
            required: true,
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
    },
    { timestamps: true }
);

if (mongoose.models && mongoose.models.PYQ) {
    delete mongoose.models.PYQ;
}
export default mongoose.model('PYQ', pyqSchema);
