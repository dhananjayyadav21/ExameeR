import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    type: {
        type: String,
        enum: ['offer', 'new', 'announcement', 'alert'],
        default: 'announcement',
    },
    link: { type: String, default: '' },          // URL to navigate on click
    linkLabel: { type: String, default: 'Learn More' },
    pages: {
        type: [String],
        enum: ['notes', 'pyq', 'course', 'all'],
        default: ['all'],
    },
    bgColor: { type: String, default: '#04bd20' },  // custom hex
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },        // null = never expires
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
}, { timestamps: true });

if (mongoose.models && mongoose.models.Banner) {
    delete mongoose.models.Banner;
}
export default mongoose.model('Banner', bannerSchema);
