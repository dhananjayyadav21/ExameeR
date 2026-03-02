import mongoose from 'mongoose';

const CertifyTestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    questions: [{
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctOptionIndex: { type: Number, required: true }
    }],
    passingScore: { type: Number, default: 75 } // Percentage
}, { timestamps: true });

export default mongoose.models.CertifyTest || mongoose.model('CertifyTest', CertifyTestSchema);
