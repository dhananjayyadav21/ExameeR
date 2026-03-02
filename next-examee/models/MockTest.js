import mongoose from 'mongoose';

const mockTestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // e.g., Engineering, Medical
    course: { type: String }, // optional mapping to specific course
    semester: { type: String },
    difficulty: { type: String, default: 'Medium', enum: ['Easy', 'Medium', 'Hard', 'Expert'] },
    durationMinutes: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    questions: [{
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswerIndex: { type: Number, required: true }, // 0 to 3
        marks: { type: Number, default: 1 },
        explanation: { type: String }
    }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }, // Instructor or Admin ID
    isPublished: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.MockTest || mongoose.model('MockTest', mockTestSchema);
