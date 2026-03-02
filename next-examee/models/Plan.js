import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
    planId: { type: String, required: true, unique: true }, // e.g., 'e0', 'plus', 'pro'
    name: { type: String, required: true },
    tagline: { type: String, default: '' },
    price: { type: Number, required: true },
    priceSuffix: { type: String, default: '/month' },
    priceLabel: { type: String, default: '' },
    accent: { type: String, default: '#04bd20' },
    accentBg: { type: String, default: '#f0fdf4' },
    badge: { type: String, default: '' },
    ribbon: { type: Boolean, default: false },
    contentAccess: { type: String, default: '' },
    features: [{
        text: { type: String, required: true },
        ok: { type: Boolean, default: true }
    }],
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

if (mongoose.models && mongoose.models.Plan) {
    delete mongoose.models.Plan;
}
export default mongoose.model('Plan', planSchema);
