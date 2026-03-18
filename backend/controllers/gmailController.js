const Assignment = require('../models/Assignment');
const { fetchAssignments } = require('../services/gmailService');

exports.fetch = async (req, res) => {
  try {
    const emails = await fetchAssignments(req.user);

    let newAssignments = [];
    let skipped = 0;

    for (const email of emails) {

      const existing = await Assignment.findOne({
        title: email.title.trim().toLowerCase(),
        userId: req.user._id
      });

      if (existing) {
        console.log("Duplicate skipped:", email.title);
        skipped++;
        continue;
      }

      const created = await Assignment.create(email);
      newAssignments.push(created);

      console.log("Inserted:", email.title);
    }

    const assignments = await Assignment.find({
      userId: req.user._id
    }).sort({ createdAt: -1 });

    res.json({
      message: `${newAssignments.length} new, ${skipped} skipped`,
      newAssignments,
      assignments
    });

  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: error.message });
  }
};