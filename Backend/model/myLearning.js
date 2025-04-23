const mongoose = require('mongoose');

const myLearningContentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  contentId: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    enum: ['Note', 'Video', 'Course'],
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MyLearningContent', myLearningContentSchema);
