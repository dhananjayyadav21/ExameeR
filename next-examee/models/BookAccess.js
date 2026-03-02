import mongoose from 'mongoose';

const BookAccessSchema = new mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExameeBook', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    accessedAt: { type: Date, default: Date.now },
    // optional: track how they accessed
    action: { type: String, enum: ['view', 'download'], default: 'view' },
});

// compound index — fast lookups by book, by user, and prevent duplicate-per-session queries
BookAccessSchema.index({ bookId: 1, userId: 1 });
BookAccessSchema.index({ bookId: 1, accessedAt: -1 });

export default mongoose.models.BookAccess || mongoose.model('BookAccess', BookAccessSchema);
