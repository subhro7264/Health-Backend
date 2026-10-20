
// const express = require('express');
// const router = express.Router();
// const { getHydration, createHydration, updateHydration } = require('../controllers/hydrationController');


// router.get('/:userId', getHydration);    
// router.post('/', createHydration);     
// router.put('/:userId', updateHydration);

// module.exports = router;

const express = require('express');
const router = express.Router();
const { getHydration, createHydration, updateHydration } = require('../controllers/hydrationController');
const { protect } = require('../middleware/auth');

// Enforce authentication on all hydration routes
router.use(protect);

router.get('/', getHydration);      
router.post('/', createHydration);    
router.put('/', updateHydration);

module.exports = router;