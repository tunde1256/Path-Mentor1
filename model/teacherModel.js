const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  subjects: [{
    type: String, // Array of subjects taught by the teacher
    required: true,
  }],
  materials: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
  }],
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
