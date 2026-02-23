import mongoose from 'mongoose';

const myLearningContentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    contentId: {
        type: String,
        required: true,
    },
    contentType: {
        type: String,
        enum: ['Note', 'Video', 'PYQ'],
        required: true,
    }
}, {
    timestamps: true
});

export default mongoose.models.MyLearningContent || mongoose.model('MyLearningContent', myLearningContentSchema);
