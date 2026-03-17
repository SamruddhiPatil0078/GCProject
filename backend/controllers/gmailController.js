const { fetchAssignments } = require('../services/gmailService');

exports.fetch = async (req, res) => {
  try {
    const assignments = await fetchAssignments(req.user);
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};