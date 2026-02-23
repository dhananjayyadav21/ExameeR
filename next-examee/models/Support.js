import mongoose from 'mongoose';

const supportSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true
    },
    body: {
        type: String,
    },
}, { timestamps: true });

export default mongoose.models.Support || mongoose.model('Support', supportSchema);
