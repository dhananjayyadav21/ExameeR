import mongoose from 'mongoose';

const ExameeBookSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: { type: String, required: true, default: 'Other' },
    subject: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    fileType: { type: String, default: 'pdf' },
    isPremium: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    tags: [{ type: String }],
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    accessCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.ExameeBook || mongoose.model('ExameeBook', ExameeBookSchema);
