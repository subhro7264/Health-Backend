
const express = require('express');
const router = express.Router();
const { getHydration, createHydration, updateHydration } = require('../controllers/hydrationController');


router.get('/:userId', getHydration);    
router.post('/', createHydration);     
router.put('/:userId', updateHydration);

module.exports = router;