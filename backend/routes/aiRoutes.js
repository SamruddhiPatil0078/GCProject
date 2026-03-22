const express = require('express');
const router = express.Router();
const { analyze, plan } = require('../controllers/aiController');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);

router.post('/analyze', analyze);
router.post('/plan', plan);

module.exports = router;