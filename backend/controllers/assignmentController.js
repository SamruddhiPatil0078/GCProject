const Assignment = require('../models/Assignment');

// 🔥 Days left helper
const getDaysLeft = (deadline) => {
  if (!deadline) return null;

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const d = new Date(deadline);
  d.setHours(0, 0, 0, 0);

  return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
};

exports.create = async (req, res) => {
  try {
    const assignment = new Assignment({ ...req.body, userId: req.user._id });
    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    let assignments = await Assignment.find({ userId: req.user._id });

    // 🔥 ADD daysLeft
    assignments = assignments.map(a => ({
      ...a._doc,
      daysLeft: getDaysLeft(a.deadline)
    }));

    // 🔥 FILTERING
    const { priority, days } = req.query;

    if (priority) {
      assignments = assignments.filter(a => a.priority === priority);
    }

    if (days) {
      assignments = assignments.filter(a => a.daysLeft !== null && a.daysLeft <= parseInt(days));
    }

    // 🔥 SORTING
    const priorityOrder = {
      OVERDUE: 0,
      HIGH: 1,
      MEDIUM: 2,
      LOW: 3
    };

    assignments.sort((a, b) => {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    res.json(assignments);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const assignment = await Assignment.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const result = {
      ...assignment._doc,
      daysLeft: getDaysLeft(assignment.deadline)
    };

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    res.json(assignment);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    res.json({ message: 'Assignment deleted' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};