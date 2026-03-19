const Assignment = require('../models/Assignment');

// CREATE
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

// GET ALL
exports.getAll = async (req, res) => {
  try {
    const assignments = await Assignment.find({ userId: req.user._id });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET BY ID
exports.getById = async (req, res) => {
  try {
    const assignment = await Assignment.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    res.json(assignment);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
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

// DELETE
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

// 🎯 CALENDAR
exports.getCalendarAssignments = async (req, res) => {
  try {
    // 🔥 REMOVE user filter temporarily
    const assignments = await Assignment.find();

    console.log("Assignments for calendar:", assignments);

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
      try {
        const deadline = extractDeadline(a.description);
        if (!deadline) continue;

        events.push({
          id: a._id?.toString() || Math.random(),
          title: cleanTitle(a.title),
          start: deadline,
          end: deadline,
          color: getColor(deadline)
        });
      } catch (innerErr) {
        console.log("Skipping bad assignment:", innerErr);
      }
    }

    res.json(events);

  } catch (error) {
    console.error("Calendar Error:", error);
    res.status(500).json({ error: error.message });
  }
};