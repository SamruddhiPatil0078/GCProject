const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({

  // 🔥 UNIQUE ID FROM GMAIL (MAIN DUPLICATE FIX)
  gmailId: {
    type: String,
    unique: true,
    sparse: true // allows manual assignments without gmailId
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    default: ''
  },

  // 🔥 DEADLINE (FIXED)
  deadline: {
    type: Date,
    default: null
  },

  // 🔥 CATEGORY
  category: {
    type: String,
    default: 'GENERAL'
  },

  // 🔥 DIFFICULTY (optional for AI)
  difficulty: {
    type: String,
    enum: ['EASY', 'MEDIUM', 'HARD'],
    default: 'MEDIUM'
  },

  // 🔥 ESTIMATED HOURS
  estimatedHours: {
    type: Number,
    default: 1
  },

  // 🔥 PRIORITY (FIXED ENUM ISSUE)
  priority: {
    type: String,
    enum: ['HIGH', 'MEDIUM', 'LOW', 'OVERDUE'],
    default: 'LOW'
  },

  // 🔥 PROGRESS
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },

  // 🔥 PLAN (for AI scheduling later)
  plan: [{
    type: String
  }],

  // 🔥 EXTRA FLAGS
  source: {
    type: String,
    default: 'manual' // or 'google_classroom'
  },

  hasPdf: {
    type: Boolean,
    default: false
  },

  // 🔥 USER LINK
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

}, { timestamps: true });


// 🔥 INDEX (BACKUP DUPLICATE PROTECTION)
assignmentSchema.index({ gmailId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Assignment', assignmentSchema);