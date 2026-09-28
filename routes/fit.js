

const express = require('express');
const router = express.Router();
const { getFitSummary } = require('../controllers/fitController');
const { protect } = require('../middleware/auth');


 router.get('/summary', protect, getFitSummary);



module.exports = router;