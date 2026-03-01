import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    bannerMode: { type: String, enum: ['text', 'image'], default: 'text' }, // text gradient or full image
    imageUrl: { type: String, default: '' },   // base64 or external URL for image banners
    type: {
        type: String,
        enum: ['offer', 'new', 'announcement', 'alert'],
        default: 'announcement',
    },
    link: { type: String, default: '' },
    linkLabel: { type: String, default: 'Learn More' },
    pages: {
        type: [String],
        enum: ['all', 'notes', 'pyq', 'course', 'video', 'mock-test', 'books', 'call-book'],
        default: ['all'],
    },
    bgColor: { type: String, default: '#04bd20' },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
}, { timestamps: true });

if (mongoose.models && mongoose.models.Banner) {
    delete mongoose.models.Banner;
}
export default mongoose.model('Banner', bannerSchema);
