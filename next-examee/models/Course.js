import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema({
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
});

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    mentor: { type: String, required: true },
    courseLevel: { type: String },
    duration: { type: String },
    price: { type: Number, required: true },
    offerPercent: { type: Number, default: 0 },
    offerPrice: { type: Number, default: 0 },
    startDate: { type: Date },
    courseContents: { type: String },
    whyChoose: { type: String },
    benefits: { type: String },
    courseImage: { type: String, required: true },
    trialVideo: { type: String, required: true },
    lectures: [lectureSchema],
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    ExmeeUserId: { type: String },
    category: {
        type: String,
        enum: ['sciTechnology', 'commerce', 'artscivils'],
        default: 'sciTechnology',
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
}, {
    timestamps: true
});

export default mongoose.models.Course || mongoose.model('Course', courseSchema);
