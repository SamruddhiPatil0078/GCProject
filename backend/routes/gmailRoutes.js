const express = require('express');
const router = express.Router();
const { fetch } = require('../controllers/gmailController');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);

router.get('/fetch', fetch);

module.exports = router;