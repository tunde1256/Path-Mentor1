const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: String,
  description: String,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  videoUrl: String,
  documentUrl: String,
  type: String,
  subject: { type: String, enum: ['English', 'Math'], required: true }, // Subject classification
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Material', materialSchema);
