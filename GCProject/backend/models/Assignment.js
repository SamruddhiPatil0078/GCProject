const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({

  gmailId: {
    type: String,
    required: true,
    unique: true
  },

  title: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date },

  category: { type: String },
  difficulty: { type: String },
  estimatedHours: { type: Number },
  priority: { type: String },
  progress: { type: Number, default: 0 },
  plan: [{ type: String }],

  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

}, { timestamps: true });

assignmentSchema.index({ gmailId: 1 }, { unique: true });

module.exports = mongoose.model('Assignment', assignmentSchema);