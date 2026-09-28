const express = require('express');
const router = express.Router();
const { getLatestDietPlan, generateDietPlan } = require('../controllers/dietController');
const { protect } = require('../middleware/auth');

router.use(protect); // Enforce auth on all diet routes

router.get('/latest', getLatestDietPlan);
router.post('/generate', generateDietPlan);

module.exports = router;