const Assignment = require('../models/Assignment');
const { fetchAssignments } = require('../services/gmailService');

exports.fetch = async (req, res) => {
  try {
    const emails = await fetchAssignments(req.user);
    let newCount = 0;

    for (const email of emails) {

      const result = await Assignment.updateOne(
        { gmailId: email.gmailId, userId: req.user._id }, // unique check
        { $setOnInsert: { ...email, userId: req.user._id } },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        console.log("New assignment inserted:", email.gmailId);
        newCount++;
      } else {
        console.log("Duplicate skipped:", email.gmailId);
      }
    }

    const assignments = await Assignment.find({
      userId: req.user._id
    }).sort({ createdAt: -1 });

    res.json({
      message: `${newCount} new assignments fetched`,
      assignments
    });

  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: error.message });
  }
};