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

    category: String,

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
    createdOn: {
        type: Date,
        default: Date.now,
    },
    updatedOn: {
        type: Date,
        default: Date.now,
    },
    deletedOn: {
        type: Date,
        default: null,
    }
});

module.exports = mongoose.model('Note', noteSchema);
