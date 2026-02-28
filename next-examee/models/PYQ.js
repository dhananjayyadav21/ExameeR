import mongoose from 'mongoose';

const pyqSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
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

export default mongoose.models.PYQ || mongoose.model('PYQ', pyqSchema);
