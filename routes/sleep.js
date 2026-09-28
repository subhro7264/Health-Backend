const express = require('express');
const router = express.Router();
const { getWeeklySleep, updateWeeklySleep } = require('../controllers/sleepController');
const { protect } = require('../middleware/auth');

router.get('/weekly', protect, getWeeklySleep);
router.post('/update', protect, updateWeeklySleep);

module.exports = router;