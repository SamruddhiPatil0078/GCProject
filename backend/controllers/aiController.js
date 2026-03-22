const { analyzeAssignment, generatePlan } = require('../services/aiService');

exports.analyze = async (req, res) => {
  try {
    const { description } = req.body;
    const result = await analyzeAssignment(description);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.plan = async (req, res) => {
  try {
    const { assignments } = req.body;
    const result = await generatePlan(assignments);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};