const express = require('express');
const router = express.Router();
const { create, getAll, getById, update, delete: deleteAssignment } = require('../controllers/assignmentController');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);

router.post('/', create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', deleteAssignment);

module.exports = router;