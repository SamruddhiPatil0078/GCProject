const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({

  gmailId: { type: String },

  title: { type: String, required: true },
  description: { type: String },

  // 🔥 ADD THIS LINE
  deadline: { type: Date },

  category: { type: String },
  difficulty: { type: String },
  estimatedHours: { type: Number },
  priority: { 
  type: String, 
  enum: ['HIGH', 'MEDIUM', 'LOW', 'OVERDUE'], 
  default: 'LOW' 
},
  progress: { type: Number, default: 0 },
  plan: [{ type: String }],

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

}, { timestamps: true });

// 🔥 FINAL DUPLICATE PROTECTION
assignmentSchema.index({ title: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Assignment', assignmentSchema);