const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({

<<<<<<< HEAD
  gmailId: { type: String },

  title: { type: String, required: true },
  description: { type: String },

  // 🔥 ADD THIS LINE
=======
  gmailId: {
    type: String,
    required: true,
    unique: true   // THIS prevents duplicates automatically
  },

  subject: {
  type: String,
  default: "General"
},

assignmentType: {
  type: String,
  default: "Other"
},
  title: { type: String, required: true },
  description: { type: String, required: true },
>>>>>>> main
  deadline: { type: Date },

  category: { type: String },
  difficulty: { type: String },
  estimatedHours: { type: Number },
<<<<<<< HEAD
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

=======
  priority: { type: String },
  progress: { type: Number, default: 0 },
  plan: [{ type: String }],

  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

}, { timestamps: true });
assignmentSchema.index({ gmailId: 1 }, { unique: true });
>>>>>>> main
module.exports = mongoose.model('Assignment', assignmentSchema);