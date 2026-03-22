const express = require('express');
const router = express.Router();





const { create, getAll, getById, update, delete: deleteAssignment, getCalendarAssignments, debugAssignments } = require('../controllers/assignmentController');

















const { isAuthenticated } = require('../middleware/auth');
const Assignment = require('../models/Assignment');


// 🔥 DEBUG ROUTE (NO AUTH)
router.get('/debug/all', async (req, res) => {
  try {
    const data = await Assignment.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔒 APPLY AUTH AFTER DEBUG
router.use(isAuthenticated);


// ✅ MAIN ROUTES
router.post('/', create);
router.get('/calendar', getCalendarAssignments);

// 🔥 PUT DEBUG HERE
router.get('/debug', debugAssignments);

router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', deleteAssignment);

module.exports = router;