const mongoose = require('mongoose');

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

    category: {
        type: String,
        enum: ['sciTechnology', 'commerce', 'artscivils'],
        default: 'sciTechnology',
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
        ref: 'User',
        required: true,
    },
    ExmeeUserId: {
        type: String
    },
    deletedAt: {
        type: Date,
        default: null,
    }
}, { timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);
