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

// ✅ CREATE
exports.create = async (req, res) => {
  try {
    const assignment = new Assignment({
      ...req.body,
      userId: req.user._id,
      deadline: req.body.deadline || new Date()
    });

    await assignment.save();
    res.status(201).json(assignment);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ GET ALL (with filtering + sorting + daysLeft)
exports.getAll = async (req, res) => {
  try {
    let assignments = await Assignment.find({ userId: req.user._id });

    assignments = assignments.map(a => ({
      ...a._doc,
      daysLeft: getDaysLeft(a.deadline)
      
    }));


    const { priority, days } = req.query;

    if (priority) {
      assignments = assignments.filter(a => a.priority === priority);
    }

    if (days) {
      assignments = assignments.filter(
        a => a.daysLeft !== null && a.daysLeft <= parseInt(days)
      );
    }

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

// 🔍 DEBUG FUNCTION (prints assignments in console)
exports.debugAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find();

    assignments.forEach(a => {
      const daysLeft = getDaysLeft(a.deadline);

      console.log(`Assignment: ${a.title}`);
      console.log(`Days Left: ${daysLeft}`);
      console.log(`Due Date: ${new Date(a.deadline).toISOString().split('T')[0]}`);
      console.log(`Priority: ${a.priority}`);
      console.log('-----------------------');
    });

    res.json({ message: "Check console for assignment logs" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET BY ID
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

// ✅ UPDATE
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

// ✅ DELETE
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

// 🎯 CALENDAR FEATURE (YOUR PART)
exports.getCalendarAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find();

    const extractDeadline = (text) => {
      if (!text) return null;

      const match = text.match(/Due\s+([A-Za-z]{3}\s+\d{1,2})/);
      if (!match) return null;

      const year = new Date().getFullYear();
      return new Date(`${match[1]}, ${year}`);
    };

    const cleanTitle = (title) => {
      if (!title) return "No Title";

      const match = title.match(/"(.+?)"/);
      return match ? match[1] : title;
    };

    const getColor = (date) => {
      if (!date) return "gray";

      const today = new Date();
      const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return "gray";
      if (diffDays <= 2) return "red";
      if (diffDays <= 5) return "orange";
      return "green";
    };

    const events = [];

    for (let a of assignments) {
      const deadline = extractDeadline(a.description);
      if (!deadline) continue;

      events.push({
        id: a._id?.toString(),
        title: cleanTitle(a.title),
        start: deadline,
        end: deadline,
        color: getColor(deadline)
      });
    }

    res.json(events);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};