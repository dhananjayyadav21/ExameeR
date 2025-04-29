const mongoose = require('mongoose');

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
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ExmeeUserId: { type: String },
}, {
    timestamps: true
}
);

module.exports = mongoose.model('Course', courseSchema);
